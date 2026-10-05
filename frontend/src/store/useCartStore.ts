import { create } from 'zustand';
import { Cart } from '@/types/api';
import api from '@/lib/axios';

interface CartState {
  cartCode: string | null;
  cart: Cart | null;
  loading: boolean;
  initCartCode: () => string;
  fetchCart: () => void;
  addToCart: (productId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

function generateCartCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartCode: null,
  cart: null,
  loading: false,

  initCartCode: () => {
    if (typeof window !== 'undefined') {
      let code = localStorage.getItem('cart_code');
      if (!code) {
        code = generateCartCode();
        localStorage.setItem('cart_code', code);
      }
      set({ cartCode: code });

      const storedCart = localStorage.getItem('cart_data');
      if (storedCart) {
        try {
          set({ cart: JSON.parse(storedCart) });
        } catch (e) {
          localStorage.removeItem('cart_data');
        }
      }
      return code;
    }
    return '';
  },

  fetchCart: () => {
    if (typeof window !== 'undefined') {
      let code = get().cartCode;
      if (!code) {
        code = get().initCartCode();
      }
      const storedCart = localStorage.getItem('cart_data');
      if (storedCart) {
        try {
          set({ cart: JSON.parse(storedCart) });
        } catch (e) {
          console.error('Error parsing stored cart', e);
        }
      }
    }
  },

  addToCart: async (productId: number) => {
    let code = get().cartCode;
    if (!code) {
      code = get().initCartCode();
    }
    set({ loading: true });
    try {
      const res = await api.post<Cart>('/add_to_cart/', {
        cart_code: code,
        product_id: productId,
      });
      set({ cart: res.data, loading: false });
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart_data', JSON.stringify(res.data));
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    set({ loading: true });
    try {
      await api.put('/update_cartitem_quantity/', {
        item_id: itemId,
        quantity,
      });

      const currentCart = get().cart;
      if (currentCart) {
        const updatedItems = currentCart.cartitems.map((item) => {
          if (item.id === itemId) {
            const price = parseFloat(item.product.price || '0');
            return {
              ...item,
              quantity,
              sub_total: price * quantity,
            };
          }
          return item;
        });

        const cartTotal = updatedItems.reduce((sum, item) => sum + item.sub_total, 0);
        const newCart: Cart = {
          ...currentCart,
          cartitems: updatedItems,
          cart_total: cartTotal,
        };

        set({ cart: newCart, loading: false });
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_data', JSON.stringify(newCart));
        }
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      set({ loading: false });
      throw error;
    }
  },

  removeItem: async (itemId: number) => {
    set({ loading: true });
    try {
      await api.delete(`/delete_cartitem/${itemId}/`);

      const currentCart = get().cart;
      if (currentCart) {
        const updatedItems = currentCart.cartitems.filter((item) => item.id !== itemId);
        const cartTotal = updatedItems.reduce((sum, item) => sum + item.sub_total, 0);
        const newCart: Cart = {
          ...currentCart,
          cartitems: updatedItems,
          cart_total: cartTotal,
        };

        set({ cart: newCart, loading: false });
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_data', JSON.stringify(newCart));
        }
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
      set({ loading: false });
      throw error;
    }
  },
}));
