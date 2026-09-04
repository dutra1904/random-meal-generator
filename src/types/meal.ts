export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strYoutube?: string | null;
  strCategory?: string | null;
  strArea?: string | null;
  strTags?: string | null;
  strSource?: string | null;
  [key: string]: string | null | undefined;
};

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea?: string | null;
};

export type MealApiResponse = {
  meals: Meal[] | null;
};

export type MealSummaryResponse = {
  meals: MealSummary[] | null;
};

export type CategoryListResponse = {
  meals: Array<{ strCategory: string }> | null;
};

export type AreaListResponse = {
  meals: Array<{ strArea: string }> | null;
};

export type Ingredient = {
  name: string;
  measure: string;
  display: string;
};

export type RequestStatus = "idle" | "loading" | "success" | "error";

export type MealFilters = {
  category: string;
  area: string;
};
