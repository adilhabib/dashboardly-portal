
export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  parentId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories?: SubCategory[];
}
