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
            <!-- <el-button type="danger" size="small" circle icon="Delete" @click="confirmRemove(scope.row)" /> -->
          </template>
        </el-table-column>
      </el-table>


      <div class="cart-summary">
        <div class="total-price">总价: ¥{{ cartStore.totalPrice.toFixed(2) }}</div>
        <el-button type="primary" size="large" style="margin-top: 10px;" @click="cartStore.checkout">结账</el-button>
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

const handleQuantityChange = async (item, newVal) => {
  if (newVal === 0) {
    await confirmRemove(item);
  } else {
    // Update quantity in backend
    // Since we don't have a direct update quantity API, we can use add/remove logic or create a new one.
    // For simplicity, let's assume we add the difference.
    // Actually, the current add API adds to existing quantity.
    // To set exact quantity, we might need a new API or logic.
    // Let's use a workaround: calculate difference and add/remove.
    // BUT, the store state is already updated by v-model locally.
    // We should probably implement an update endpoint or just re-add the difference.
    
    // Better approach: Implement updateCartItem in store/API.
    // For now, let's assume we just call addToCart with difference? No, that's risky.
    // Let's add an update action to the store.
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
      // If cancelled and quantity was 0, revert to 1 (or previous value if we tracked it)
      if (item.quantity === 0) {
        item.quantity = 1; // Simple revert
        cartStore.updateQuantity(item.product_id, 1);
      }
    });
};
</script>

