import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as { id: number; username: string } | null,
  }),
  actions: {
    async fetchUser() {
      try {
        const { user } = await $fetch<{ user: { id: number; username: string } }>('/api/auth/me');
        this.user = user;
      } catch (e) {
        this.user = null;
      }
    },
    async login(credentials: any) {
      const { user } = await $fetch<{ user: { id: number; username: string } }>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      this.user = user;
    },
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' });
      this.user = null;
    },
  },
});
