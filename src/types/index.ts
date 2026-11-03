export type Category =
  "Hambúrgueres" | "Combos" | "Acompanhamentos" | "Bebidas";
export interface Ingredient {
  id: string;
  name: string;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  removableIngredients?: Ingredient[];
  badge?: string;
}
export interface Extra {
  id: string;
  name: string;
  price: number;
}
export interface CartItem {
  id: string;
  productId: string;
  extras: string[];
  removedIngredients: string[];
  notes: string;
  quantity: number;
}
export interface CheckoutDetails {
  name: string;
  phone: string;
  mode: "delivery" | "pickup";
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  notes: string;
}
export type CheckoutField = Exclude<keyof CheckoutDetails, "mode" | "notes">;
