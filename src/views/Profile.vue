<script setup lang="ts">
import { useUserStore } from '../stores/user';
import { ref, onMounted } from 'vue';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const userStore = useUserStore();
const userProfile = ref({
  name: '',
  age: '',
  weight: '',
  height: '',
  fitnessGoals: [],
});

onMounted(async () => {
  if (userStore.user) {
    const userDoc = await getDoc(doc(db, 'users', userStore.user.uid));
    if (userDoc.exists()) {
      userProfile.value = userDoc.data();
    }
  }
});

const saveProfile = async () => {
  if (userStore.user) {
    await setDoc(doc(db, 'users', userStore.user.uid), userProfile.value);
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Profile Settings</h2>
    
    <form @submit.prevent="saveProfile" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          v-model="userProfile.name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          v-model="userProfile.age"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Weight (kg)</label>
        <input
          type="number"
          v-model="userProfile.weight"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Height (cm)</label>
        <input
          type="number"
          v-model="userProfile.height"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Save Profile
      </button>
    </form>
  </div>
</template>