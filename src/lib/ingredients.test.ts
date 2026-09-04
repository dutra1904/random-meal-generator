import { describe, expect, it } from "vitest";
import { parseIngredients } from "./ingredients";
import type { Meal } from "../types/meal";

const meal = {
  idMeal: "1",
  strMeal: "Teste",
  strMealThumb: "https://example.com/meal.jpg",
  strInstructions: "Misture.",
  strIngredient1: "Farinha",
  strMeasure1: "200g",
  strIngredient2: "  Água  ",
  strMeasure2: "  1 xícara ",
  strIngredient3: "",
  strMeasure3: "1 colher",
  strIngredient4: "Sal",
  strMeasure4: "   ",
} as Meal;

describe("parseIngredients", () => {
  it("junta nome e medida e ignora slots vazios", () => {
    expect(parseIngredients(meal)).toEqual([
      { name: "Farinha", measure: "200g", display: "Farinha – 200g" },
      { name: "Água", measure: "1 xícara", display: "Água – 1 xícara" },
      { name: "Sal", measure: "", display: "Sal" },
    ]);
  });
});
