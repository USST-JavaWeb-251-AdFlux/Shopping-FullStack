<template>
  <div v-if="product" class="product-detail">
    <img :src="product.mainImage" :alt="product.name" class="detail-image">
    <div class="detail-info">
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <div class="detail-price">¥{{ product.price }}</div>
      <p>库存: {{ product.quantity }}</p>
      
      <div class="quantity-selector">
        <label>数量:</label>
        <el-input-number v-model="quantity" :min="1" :max="product.quantity" />
      </div>

      <div class="action-buttons">
        <el-button type="primary" @click="addToCart">加入购物车</el-button>
        <el-button type="danger" @click="buyNow">立即购买</el-button>
      </div>
    </div>
  </div>
  <div v-else>加载中...</div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';
import { useUserStore } from '~/stores/user';

const route = useRoute();
const cartStore = useCartStore();
const userStore = useUserStore();
const quantity = ref(1);

const { data: product } = await useFetch(`/api/products/${route.params.id}`);

const addToCart = async () => {
  await cartStore.addToCart(product.value, quantity.value);
  ElMessage.success('已加入购物车');
};

const buyNow = async () => {
  if (!userStore.user) {
    navigateTo('/login');
    return;
  }
  try {
    await $fetch('/api/checkout', {
      method: 'POST',
      body: {
        items: [{ productId: product.value.id, quantity: quantity.value }]
      }
    });
    navigateTo('/success');
  } catch (e) {
    ElMessage.error('购买失败: ' + (e.data?.statusMessage || e.message));
  }
};
</script>
