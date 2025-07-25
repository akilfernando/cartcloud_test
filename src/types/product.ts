export interface Product {
  _id: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  vendorId: string;
}
