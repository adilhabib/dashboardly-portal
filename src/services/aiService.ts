import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Food } from '@/types/food';
import type { Order } from '@/services/order';

type RewrittenNotification = {
  title: string;
  body: string;
};

const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
const GEMINI_MODEL = 'gemini-1.5-flash';

class AIService {
  private static client: GoogleGenerativeAI | null = null;

  private static getClient(): GoogleGenerativeAI | null {
    if (!GEMINI_API_KEY) {
      return null;
    }

    if (!this.client) {
      this.client = new GoogleGenerativeAI(GEMINI_API_KEY);
    }

    return this.client;
  }

  private static extractJson(text: string): unknown {
    const directParse = () => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    };

    const direct = directParse();
    if (direct !== null) {
      return direct;
    }

    const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) {
      try {
        return JSON.parse(fenced[1]);
      } catch {
        return null;
      }
    }

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }

    return null;
  }

  static async getRecommendedProducts(allProducts: Food[], history: Order[]): Promise<Food[]> {
    if (allProducts.length === 0) {
      return [];
    }

    const fallback = allProducts
      .filter((food) => food.is_available)
      .sort((a, b) => Number(Boolean(b.is_popular)) - Number(Boolean(a.is_popular)))
      .slice(0, 8);

    const client = this.getClient();
    if (!client) {
      return fallback;
    }

    try {
      const model = client.getGenerativeModel({ model: GEMINI_MODEL });
      const productsForPrompt = allProducts.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        is_available: item.is_available,
        is_popular: item.is_popular,
      }));

      const historySummary = {
        total_orders: history.length,
        latest_order_dates: history.slice(0, 10).map((o) => o.created_at),
        recent_statuses: history.slice(0, 15).map((o) => o.status),
      };

      const prompt = `
You are a food recommendation assistant for a restaurant admin dashboard.
Choose up to 8 products that should be highlighted in a "Handpicked for You" section.

Rules:
- Recommend only currently available items.
- Balance variety across categories when possible.
- Prefer products likely to convert (popular/accessible price points are good signals).
- Never invent product IDs.

Return only valid JSON with this shape:
{"recommended_ids":["id1","id2","id3"]}

Products:
${JSON.stringify(productsForPrompt)}

Order history summary:
${JSON.stringify(historySummary)}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim() || '';
      const parsed = this.extractJson(text) as { recommended_ids?: string[] } | null;
      const pickedIds = parsed?.recommended_ids?.filter((id): id is string => typeof id === 'string') ?? [];

      if (pickedIds.length === 0) {
        return fallback;
      }

      const byId = new Map(allProducts.map((item) => [item.id, item]));
      const mapped = pickedIds
        .map((id) => byId.get(id))
        .filter((item): item is Food => Boolean(item) && item.is_available)
        .slice(0, 8);

      return mapped.length > 0 ? mapped : fallback;
    } catch (error) {
      console.error('AI recommendation failed:', error);
      return fallback;
    }
  }

  static async rewriteNotification(title: string, body: string): Promise<RewrittenNotification> {
    const safeTitle = title.trim() || 'Update';
    const safeBody = body.trim();
    const client = this.getClient();

    if (!client || !safeBody) {
      return { title: safeTitle, body: safeBody };
    }

    try {
      const model = client.getGenerativeModel({ model: GEMINI_MODEL });
      const prompt = `
Rewrite this notification for a food delivery context.
Keep it concise and user-friendly.

Constraints:
- Keep meaning accurate.
- Use plain text only (no markdown).
- Title max 60 characters.
- Body max 140 characters.
- No hype or fake urgency.

Return only valid JSON:
{"title":"...", "body":"..."}

Input title: ${JSON.stringify(safeTitle)}
Input body: ${JSON.stringify(safeBody)}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim() || '';
      const parsed = this.extractJson(text) as { title?: string; body?: string } | null;
      const rewrittenTitle = parsed?.title?.trim() || safeTitle;
      const rewrittenBody = parsed?.body?.trim() || safeBody;

      return {
        title: rewrittenTitle.slice(0, 60),
        body: rewrittenBody.slice(0, 140),
      };
    } catch (error) {
      console.error('AI notification rewrite failed:', error);
      return { title: safeTitle, body: safeBody };
    }
  }
}

export default AIService;
