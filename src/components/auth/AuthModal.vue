<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

const emit = defineEmits(['close', 'success']);
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }
    emit('success');
    emit('close');
  } catch (e: any) {
    error.value = e.message;
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <h2 class="text-2xl font-bold mb-6">
        {{ isLogin ? 'Sign In' : 'Create Account' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="isLogin = !isLogin"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            {{ isLogin ? 'Need an account?' : 'Already have an account?' }}
          </button>
          
          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </button>
        </div>
      </form>

      <button
        @click="emit('close')"
        class="mt-4 text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
    </div>
  </div>
</template>