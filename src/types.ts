export interface User {
  name: string;
  email: string;
  tier: string;
  purchaseCount: number;
  isAdmin?: boolean;
}

export interface Meal {
  id: string;
  name: string;
  desc: string;
  price: number;
  distance: number;
  img: string;
  category: string;
}

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  cal: number;
}

export interface CartItem extends Meal {
  cartId: string;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
}
