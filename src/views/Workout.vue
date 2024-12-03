<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWorkoutStore } from '../stores/workout';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Workout } from '../types';
import { useUserStore } from '../stores/user';

const workoutStore = useWorkoutStore();
const userStore = useUserStore();
const workouts = ref<Workout[]>([]);
const loading = ref(true);

onMounted(async () => {
  if (userStore.user) {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', userStore.user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      workouts.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Workout));
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Your Saved Workouts</h2>
    
    <div v-if="loading" class="text-center py-8">
      <p>Loading your workouts...</p>
    </div>
    
    <div v-else-if="workouts.length === 0" class="text-center py-8">
      <p>No saved workouts yet. Generate your first workout plan!</p>
      <router-link
        to="/"
        class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Generate Workout
      </router-link>
    </div>
    
    <div v-else class="grid gap-6 md:grid-cols-1">
      <div
        v-for="workout in workouts"
        :key="workout.id"
        class="bg-white p-6 rounded-lg shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold">{{ workout.title }}</h3>
            <p class="text-gray-600">
              Created: {{ new Date(workout.createdAt).toLocaleDateString() }}
            </p>
          </div>
          <div class="text-right">
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {{ workout.difficulty }}
            </span>
            <p class="text-gray-600 mt-1">{{ workout.duration }} minutes</p>
          </div>
        </div>
        
        <div class="mt-4 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
          {{ workout.gptResponse }}
        </div>
      </div>
    </div>
  </div>
</template>