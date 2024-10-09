export interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  weight: number;
  desc: string;
  compound: string[];
  calories: number;
  categoryId: number;
  count: number;
}
export interface Category {
  id: number;
  icon: string;
  title: string;
}
export interface Order {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  dostavkaTuri: "Самовывоз" | "Доставка";
  dom?: string;
  etaj?: number;
  domofon?: string;
  orders: Array<Product>;
  totalPrice: number;
}
