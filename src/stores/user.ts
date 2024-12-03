import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '../config/firebase';
import type { User } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);

  const setUser = (newUser: User | null) => {
    user.value = newUser;
    loading.value = false;
  };

  return {
    user,
    loading,
    setUser,
  };
});