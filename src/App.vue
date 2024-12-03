<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/layout/Navbar.vue';

const userStore = useUserStore();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    userStore.setUser(user);
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <router-view />
  </div>
</template>