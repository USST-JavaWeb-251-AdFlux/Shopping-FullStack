<template>
  <div class="auth-form">
    <h2>登录</h2>
    <el-form @submit.prevent="handleLogin" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="username" required />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="password" required show-password />
      </el-form-item>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <el-button type="primary" native-type="submit" style="width: 100%;">登录</el-button>
    </el-form>
    <p style="margin-top: 10px; text-align: center;">
      还没有账号? <NuxtLink to="/register">注册</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { useCartStore } from '~/stores/cart';

const username = ref('');
const password = ref('');
const error = ref('');
const userStore = useUserStore();
const cartStore = useCartStore();

const handleLogin = async () => {
  try {
    await userStore.login({ username: username.value, password: password.value });
    await cartStore.fetchCart();
    navigateTo('/');
  } catch (e) {
    error.value = e.data?.statusMessage || '登录失败';
    ElMessage.error(error.value);
  }
};
</script>


