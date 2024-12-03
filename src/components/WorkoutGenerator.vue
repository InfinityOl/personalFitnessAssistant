<script setup lang="ts">
import { ref } from 'vue';
import { useWorkoutStore } from '../stores/workout';
import { useUserStore } from '../stores/user';
import type { WorkoutPreferences, NutritionPreferences } from '../types';
import AuthModal from './auth/AuthModal.vue';
import { generateNutritionPlan } from '../config/openai';

const workoutStore = useWorkoutStore();
const userStore = useUserStore();
const error = ref<string | null>(null);
const showAuthModal = ref(false);
const showNutritionPlan = ref(false);
const nutritionPlan = ref<string | null>(null);
const isGeneratingNutrition = ref(false);

const preferences = ref<WorkoutPreferences>({
  duration: 30,
  difficulty: 'beginner',
  userId: '',
  workoutType: 'strength',
  equipment: [],
  goals: [],
  focusAreas: [],
  language: 'en'
});

const nutritionPreferences = ref<NutritionPreferences>({
  goal: 'maintenance',
  dietaryRestrictions: [],
  mealsPerDay: 3,
  allergies: []
});

const equipmentOptions = [
  'Dumbbells',
  'Resistance Bands',
  'Bodyweight Only',
  'Pull-up Bar',
  'Yoga Mat',
  'Kettlebell',
  'Barbell',
  'Gym Machine'
];

const goalOptions = [
  'Weight Loss',
  'Muscle Gain',
  'Endurance',
  'Flexibility',
  'Strength',
  'General Fitness'
];

const focusAreaOptions = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core',
  'Back',
  'Chest',
  'Arms',
  'Legs'
];

const dietaryRestrictionOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo'
];

const allergyOptions = [
  'Nuts',
  'Dairy',
  'Eggs',
  'Soy',
  'Wheat',
  'Shellfish',
  'Fish'
];

const generateNewWorkout = async () => {
  error.value = null;
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      error.value = 'OpenAI API key is not configured. Please check the environment configuration.';
      return;
    }
    await workoutStore.generateWorkout(preferences.value);
  } catch (e: any) {
    error.value = 'Failed to generate workout. Please check your API key configuration and try again.';
    console.error('Workout generation error:', e);
  }
};

const generateNutrition = async () => {
  error.value = null;
  isGeneratingNutrition.value = true;
  try {
    const response = await generateNutritionPlan(nutritionPreferences.value, preferences.value.language);
    nutritionPlan.value = response;
    showNutritionPlan.value = true;
  } catch (e: any) {
    error.value = 'Failed to generate nutrition plan.';
    console.error('Nutrition generation error:', e);
  } finally {
    isGeneratingNutrition.value = false;
  }
};

const handleSaveWorkout = () => {
  if (!userStore.user) {
    showAuthModal.value = true;
  } else {
    workoutStore.saveCurrentWorkout(userStore.user.uid);
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Generate Your Workout</h2>
    
    <div class="space-y-6">
      <!-- Workout Type -->
      <div>
        <label class="block text-sm font-medium mb-2">Workout Type</label>
        <select
          v-model="preferences.workoutType"
          class="w-full px-3 py-2 border rounded-lg"
        >
          <option value="strength">Strength Training</option>
          <option value="cardio">Cardio</option>
          <option value="hiit">HIIT</option>
          <option value="flexibility">Flexibility</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <!-- Duration -->
      <div>
        <label class="block text-sm font-medium mb-2">Duration (minutes)</label>
        <input
          type="number"
          v-model="preferences.duration"
          class="w-full px-3 py-2 border rounded-lg"
          min="10"
          max="120"
          step="5"
        />
      </div>

      <!-- Difficulty -->
      <div>
        <label class="block text-sm font-medium mb-2">Difficulty</label>
        <select
          v-model="preferences.difficulty"
          class="w-full px-3 py-2 border rounded-lg"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <!-- Equipment -->
      <div>
        <label class="block text-sm font-medium mb-2">Available Equipment</label>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="equipment in equipmentOptions"
            :key="equipment"
            class="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              :value="equipment"
              v-model="preferences.equipment"
              class="rounded border-gray-300"
            />
            <span>{{ equipment }}</span>
          </label>
        </div>
      </div>

      <!-- Goals -->
      <div>
        <label class="block text-sm font-medium mb-2">Fitness Goals</label>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="goal in goalOptions"
            :key="goal"
            class="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              :value="goal"
              v-model="preferences.goals"
              class="rounded border-gray-300"
            />
            <span>{{ goal }}</span>
          </label>
        </div>
      </div>

      <!-- Focus Areas -->
      <div>
        <label class="block text-sm font-medium mb-2">Focus Areas</label>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="area in focusAreaOptions"
            :key="area"
            class="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              :value="area"
              v-model="preferences.focusAreas"
              class="rounded border-gray-300"
            />
            <span>{{ area }}</span>
          </label>
        </div>
      </div>

      <!-- Language -->
      <div>
        <label class="block text-sm font-medium mb-2">Language</label>
        <select
          v-model="preferences.language"
          class="w-full px-3 py-2 border rounded-lg"
        >
          <option value="en">English</option>
          <option value="uk">Ukrainian</option>
          <option value="ru">Russian</option>
        </select>
      </div>

      <!-- Nutrition Preferences -->
      <div class="border-t pt-6">
        <h3 class="text-xl font-semibold mb-4">Nutrition Preferences</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Goal</label>
            <select
              v-model="nutritionPreferences.goal"
              class="w-full px-3 py-2 border rounded-lg"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Meals per Day</label>
            <input
              type="number"
              v-model="nutritionPreferences.mealsPerDay"
              class="w-full px-3 py-2 border rounded-lg"
              min="2"
              max="6"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Dietary Restrictions</label>
            <div class="grid grid-cols-2 gap-2">
              <label
                v-for="restriction in dietaryRestrictionOptions"
                :key="restriction"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="restriction"
                  v-model="nutritionPreferences.dietaryRestrictions"
                  class="rounded border-gray-300"
                />
                <span>{{ restriction }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Allergies</label>
            <div class="grid grid-cols-2 gap-2">
              <label
                v-for="allergy in allergyOptions"
                :key="allergy"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="allergy"
                  v-model="nutritionPreferences.allergies"
                  class="rounded border-gray-300"
                />
                <span>{{ allergy }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Buttons -->
      <div class="flex space-x-4">
        <button
          @click="generateNewWorkout"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          :disabled="workoutStore.loading"
        >
          {{ workoutStore.loading ? 'Generating Workout...' : 'Generate Workout' }}
        </button>
        
        <button
          @click="generateNutrition"
          class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          :disabled="isGeneratingNutrition"
        >
          {{ isGeneratingNutrition ? 'Generating Plan...' : 'Generate Nutrition Plan' }}
        </button>
      </div>

      <div v-if="error" class="text-red-600 text-sm p-3 bg-red-50 rounded-lg">{{ error }}</div>

      <!-- Workout Plan Result -->
      <div v-if="workoutStore.currentWorkoutPlan" class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Your Generated Workout Plan</h3>
        <div class="bg-white p-6 rounded-lg shadow-md whitespace-pre-wrap">
          {{ workoutStore.currentWorkoutPlan }}
        </div>
        
        <div class="mt-4 flex justify-end">
          <button
            @click="handleSaveWorkout"
            class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Save Workout
          </button>
        </div>
      </div>

      <!-- Nutrition Plan Result -->
      <div v-if="nutritionPlan" class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Your Nutrition Plan</h3>
        <div class="bg-white p-6 rounded-lg shadow-md whitespace-pre-wrap">
          {{ nutritionPlan }}
        </div>
      </div>
      
      <p v-if="!userStore.user" class="mt-4 text-sm text-gray-600 text-center">
        Want to save this workout? Sign in or create an account!
      </p>
    </div>

    <AuthModal
      v-if="showAuthModal"
      @close="showAuthModal = false"
      @success="handleSaveWorkout"
    />
  </div>
</template>