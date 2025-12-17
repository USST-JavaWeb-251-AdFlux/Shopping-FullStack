<template>
  <div>
    <div class="filters">
      <div style="display: flex; align-items: center; gap: 10px;">
        <strong>分类: </strong>
        <el-select v-model="selectedCategory" @change="updateFilter" style="width: 150px;">
          <el-option label="全部" value="All" />
          <el-option label="电子产品" value="Electronics" />
          <el-option label="服装" value="Clothing" />
          <el-option label="家具" value="Furniture" />
        </el-select>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <strong>排序: </strong>
        <el-select v-model="selectedSort" @change="updateFilter" style="width: 150px;">
          <el-option label="默认" value="" />
          <el-option label="价格: 从低到高" value="price_asc" />
          <el-option label="价格: 从高到低" value="price_desc" />
        </el-select>
      </div>
    </div>

    <div class="product-grid">
      <el-card v-for="product in products" :key="product.id" class="product-card" :body-style="{ padding: '0px' }">
        <NuxtLink :to="`/product/${product.id}`">
          <img :src="product.mainImage" :alt="product.name" class="product-image">
          <div style="padding: 14px;">
            <h3 class="product-title">{{ product.name }}</h3>
            <div class="product-price">¥{{ product.price }}</div>
          </div>
        </NuxtLink>
        <div style="padding: 0 14px 14px;">
          <el-button type="primary" style="width: 100%;" @click="addToCart(product)">加入购物车</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const selectedCategory = ref(route.query.category || 'All');
const selectedSort = ref(route.query.sort || '');
const searchQuery = computed(() => route.query.search || '');

const { data: products, refresh } = await useFetch('/api/products', {
  query: computed(() => ({
    category: selectedCategory.value,
    sort: selectedSort.value,
    search: searchQuery.value
  }))
});

const updateFilter = () => {
  router.push({
    query: {
      ...route.query,
      category: selectedCategory.value,
      sort: selectedSort.value
    }
  });
};

const addToCart = async (product) => {
  await cartStore.addToCart(product);
  ElMessage.success('已加入购物车');
};

watch(() => route.query, () => {
  selectedCategory.value = route.query.category || 'All';
  selectedSort.value = route.query.sort || '';
  refresh();
});
</script>

