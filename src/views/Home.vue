<script setup lang="ts">
import WorkoutGenerator from '../components/WorkoutGenerator.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">
        Personal Fitness Assistant
      </h1>
      
      <WorkoutGenerator />
    </main>
  </div>
</template>