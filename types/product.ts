export interface Nutrition {
  energy_kcal: number | null;
  energy_kj: number | null;
  fat: number | null;
  carbohydrates: number | null;
  protein: number | null;
  salt: number | null;
}

export interface Product {
  _id?: string;
  bar_code: string;
  product_name: string;
  brand_name: string;
  nutrition: Nutrition;
}
