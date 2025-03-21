
export class ChartDataTransformer {
  static transformDoubleLineToSingleValue(data: Array<{ name: string; value1: number; value2: number }>) {
    // Simplifies data to just have name and value properties
    return data.map(item => ({ 
      name: item.name, 
      value: item.value1 // Just use value1 for bar charts expecting value
    }));
  }
}
