import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Workout, WorkoutPreferences } from '../types';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { generateWorkoutPlan } from '../config/openai';

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref<Workout[]>([]);
  const loading = ref(false);
  const currentWorkoutPlan = ref<string | null>(null);
  const currentPreferences = ref<WorkoutPreferences | null>(null);

  const generateWorkout = async (preferences: WorkoutPreferences) => {
    loading.value = true;
    try {
      const response = await generateWorkoutPlan(preferences);
      currentWorkoutPlan.value = response;
      currentPreferences.value = preferences;
    } catch (error) {
      console.error('Error generating workout:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const saveCurrentWorkout = async (userId: string) => {
    if (!currentWorkoutPlan.value || !currentPreferences.value) return;

    const workout: Workout = {
      id: Date.now().toString(),
      title: `${currentPreferences.value.difficulty} Workout - ${currentPreferences.value.duration} min`,
      exercises: [],
      duration: currentPreferences.value.duration,
      difficulty: currentPreferences.value.difficulty,
      userId: userId,
      createdAt: new Date(),
      gptResponse: currentWorkoutPlan.value,
      language: currentPreferences.value.language
    };
    
    await addDoc(collection(db, 'workouts'), workout);
    workouts.value.push(workout);
  };

  const clearCurrentWorkout = () => {
    currentWorkoutPlan.value = null;
    currentPreferences.value = null;
  };

  return {
    workouts,
    loading,
    currentWorkoutPlan,
    generateWorkout,
    saveCurrentWorkout,
    clearCurrentWorkout,
  };
});