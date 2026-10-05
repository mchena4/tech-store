export interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

export interface ProductSpecification {
  id: number;
  name: string;
  value: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  price: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  featured: boolean;
  category: Category | null;
  brand: Brand | null;
  specifications: ProductSpecification[];
}

export interface CategoryDetail extends Category {
  products: ProductSummary[];
}

export interface CartItem {
  id: number;
  product: ProductSummary;
  quantity: number;
  sub_total: number;
}

export interface Cart {
  id: number;
  cart_code: string;
  cartitems: CartItem[];
  cart_total: number;
}

export interface Review {
  id: number;
  user: User;
  rating: number;
  review: string;
  created: string;
  updated: string;
}

export interface Wishlist {
  id: number;
  user: number;
  product: number;
  created: string;
}

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  order_code: string;
  total_amount: string;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Canceled';
  mercadopago_payment_id: string | null;
  shipping_address: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface PreferenceResponse {
  preference_id: string;
  init_point: string;
}
