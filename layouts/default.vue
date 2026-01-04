<template>
  <div>
    <header class="header">
      <div class="container header-content">
        <div class="brand">
          <NuxtLink to="/" style="font-size: 1.2em; font-weight: bold;">Shopping Site</NuxtLink>
        </div>
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品..."
            @keyup.enter="handleSearch"
            class="search-input"
            style="max-width: 400px;"
          >
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>

        <div class="user-actions">
          <NuxtLink to="/cart">
            购物车 ({{ cartStore.totalItems }})
          </NuxtLink>
          <template v-if="userStore.user">
            <span>欢迎, {{ userStore.user.username }}</span>
            <a href="#" @click.prevent="logout">退出</a>
          </template>
          <template v-else>
            <NuxtLink to="/login">登录</NuxtLink>
            <NuxtLink to="/register">注册</NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <div class="container main-layout">
      <aside class="sidebar">
        <div class="sidebar-menu">
          <h3>分类</h3>
          <ul>
            <li><NuxtLink to="/?category=Electronics">电子产品</NuxtLink></li>
            <li><NuxtLink to="/?category=Clothing">服装</NuxtLink></li>
            <li><NuxtLink to="/?category=Furniture">家具</NuxtLink></li>
          </ul>
        </div>
        <div class="sidebar-ad">
          <adflux-slot layout="sidebar"></adflux-slot>
        </div>
      </aside>

      <main class="content">
        <slot />
      </main>

      <aside class="sidebar">
        <div class="sidebar-ad">
          <adflux-slot layout="sidebar"></adflux-slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { useCartStore } from '~/stores/cart';

const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();
const searchQuery = ref('');

const handleSearch = () => {
  router.push({ path: '/', query: { ...route.query, search: searchQuery.value } });
};

onMounted(async () => {
  await userStore.fetchUser();
  if (userStore.user) {
    await cartStore.fetchCart();
  }
});

const logout = async () => {
  await userStore.logout();
  cartStore.items = [];
  navigateTo('/login');
};
</script>
