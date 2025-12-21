<template>
  <div class="auth-form">
    <h2>注册</h2>
    <el-form @submit.prevent="handleRegister" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="username" required />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="password" required show-password />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="confirmPassword" required show-password />
      </el-form-item>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <el-button type="primary" native-type="submit" style="width: 100%;">注册</el-button>
    </el-form>
    <p style="margin-top: 10px; text-align: center;">
      已有账号? <NuxtLink to="/login">登录</NuxtLink>
    </p>
  </div>
</template>

<script setup>
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致';
    ElMessage.error(error.value);
    return;
  }
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    });
    ElMessage.success('注册成功，请登录');
    navigateTo('/login');
  } catch (e) {
    error.value = e.data?.statusMessage || '注册失败';
    ElMessage.error(error.value);
  }
};
</script>
