<template>
  <div>
    <h1>购物车</h1>
    <div v-if="cartStore.items.length > 0">
      <el-table :data="cartStore.items" style="width: 100%">
        <el-table-column label="商品" min-width="200">
          <template #default="scope">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img :src="scope.row.mainImage" width="50" height="50" style="object-fit: cover;">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="160">
          <template #default="scope">
            <el-input-number 
              v-model="scope.row.quantity" 
              :min="0" 
              size="small"
              @change="(val) => handleQuantityChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="总计" width="100">
          <template #default="scope">
            ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button type="danger" size="small" @click="confirmRemove(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>


      <div class="cart-summary">
        <div class="total-price">总价: ¥{{ cartStore.totalPrice.toFixed(2) }}</div>
        <el-button type="primary" size="large" style="margin-top: 10px;" @click="handleCheckout">结账</el-button>
      </div>
    </div>
    <div v-else>
      <p>您的购物车是空的。</p>
      <NuxtLink to="/">
        <el-button type="primary">去购物</el-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

definePageMeta({
  middleware: ['auth']
});

const handleCheckout = async () => {
  try {
    await cartStore.checkout();
  } catch (e) {
    ElNotification({
      title: '错误',
      message: '结账失败: ' + (e.data?.statusMessage || e.message),
      type: 'error',
    });
  }
};

const handleQuantityChange = async (item, newVal) => {
  if (newVal === 0) {
    await confirmRemove(item);
  } else {
    await cartStore.updateQuantity(item.product_id, newVal);
  }
};

const confirmRemove = (item) => {
  ElMessageBox.confirm(
    '确定要从购物车中移除该商品吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await cartStore.removeFromCart(item.product_id);
      ElMessage.success('已移除');
    })
    .catch(() => {
      if (item.quantity === 0) {
        item.quantity = 1; // Simple revert
        cartStore.updateQuantity(item.product_id, 1);
      }
    });
};
</script>
