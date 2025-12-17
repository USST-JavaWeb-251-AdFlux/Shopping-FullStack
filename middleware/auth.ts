import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  if (!userStore.user) {
    // Try to fetch user if not loaded (e.g. page refresh)
    await userStore.fetchUser();
    if (!userStore.user) {
      return navigateTo('/login');
    }
  }
});
