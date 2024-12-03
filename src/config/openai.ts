import OpenAI from 'openai';
import type { WorkoutPreferences, NutritionPreferences } from '../types';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
}

export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

const languageInstructions = {
  en: 'Respond in English.',
  uk: 'Відповідай українською мовою.',
  ru: 'Отвечай на русском языке.'
};

export const generateWorkoutPlan = async (preferences: WorkoutPreferences) => {
  try {
    const prompt = `Generate a ${preferences.difficulty} level ${preferences.workoutType} workout for ${preferences.duration} minutes.
    Equipment available: ${preferences.equipment.join(', ')}
    Focus areas: ${preferences.focusAreas.join(', ')}
    Goals: ${preferences.goals.join(', ')}
    
    Please provide a detailed workout plan including:
    1. Warm-up exercises
    2. Main workout with sets, reps, and rest periods
    3. Cool-down exercises
    4. Total estimated calories burned
    5. Safety tips and form cues`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are a professional fitness trainer. Create detailed, safe, and effective workout plans. ${languageInstructions[preferences.language]}` 
        },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

export const generateNutritionPlan = async (preferences: NutritionPreferences, language: string) => {
  try {
    const prompt = `Generate a nutrition plan with the following requirements:
    Goal: ${preferences.goal}
    Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}
    Meals per day: ${preferences.mealsPerDay}
    Target calories: ${preferences.calories || 'Calculate based on goal'}
    Allergies: ${preferences.allergies.join(', ')}
    
    Please provide:
    1. Daily meal plan with timing
    2. Macronutrient breakdown
    3. Portion sizes
    4. Alternative options for each meal
    5. Hydration recommendations`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are a professional nutritionist. Create personalized, healthy meal plans. ${languageInstructions[language]}` 
        },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};