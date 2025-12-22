import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
  },
  actions: {
    async fetchCart() {
      const userStore = useUserStore();
      if (!userStore.user) {
        this.items = [];
        return;
      }
      try {
        const items = await $fetch('/api/cart');
        this.items = items as any[];
      } catch (e) {
        console.error('Failed to fetch cart', e);
      }
    },
    async addToCart(product: any, quantity: number = 1) {
      const userStore = useUserStore();
      if (!userStore.user) {
        navigateTo('/login');
        return;
      }
      try {
        await $fetch('/api/cart/add', {
          method: 'POST',
          body: { productId: product.id, quantity },
        });
        await this.fetchCart();
      } catch (e) {
        console.error('Failed to add to cart', e);
      }
    },
    async removeFromCart(productId: number) {
      try {
        await $fetch('/api/cart/remove', {
          method: 'POST',
          body: { productId },
        });
        await this.fetchCart();
      } catch (e) {
        console.error('Failed to remove from cart', e);
      }
    },
    async updateQuantity(productId: number, quantity: number) {
      try {
        await $fetch('/api/cart/update', {
          method: 'POST',
          body: { productId, quantity },
        });
        await this.fetchCart();
      } catch (e) {
        console.error('Failed to update cart', e);
      }
    },
    async checkout() {
      try {
        await $fetch('/api/checkout', { method: 'POST', body: {} });
        this.items = [];
        navigateTo('/success');
      } catch (e) {
        throw e;
      }
    }
  },
});
