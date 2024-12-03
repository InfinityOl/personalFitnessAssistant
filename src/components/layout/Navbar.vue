<script setup lang="ts">
import { useUserStore } from '../../stores/user';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleSignOut = async () => {
  await signOut(auth);
  router.push('/');
};
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-blue-600">FitnessMVP</span>
          </router-link>
        </div>
        
        <div class="flex items-center" v-if="userStore.user">
          <router-link
            to="/workout"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Workouts
          </router-link>
          <router-link
            to="/profile"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Profile
          </router-link>
          <button
            @click="handleSignOut"
            class="ml-4 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>