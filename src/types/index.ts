export interface WorkoutPreferences {
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userId: string;
  workoutType: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'mixed';
  equipment: string[];
  goals: string[];
  focusAreas: string[];
  language: 'en' | 'uk' | 'ru';
}

export interface NutritionPreferences {
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  dietaryRestrictions: string[];
  mealsPerDay: number;
  calories?: number;
  allergies: string[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  restTime: number;
}

export interface Workout {
  id: string;
  title: string;
  exercises: Exercise[];
  duration: number;
  difficulty: string;
  workoutType: string;
  userId: string;
  createdAt: Date;
  gptResponse?: string;
  language?: string;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  createdAt: Date;
  dietaryRestrictions: string[];
  goal: string;
}

export interface Meal {
  name: string;
  foods: Food[];
  timing: string;
}

export interface Food {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}