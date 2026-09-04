import { useCallback, useState } from "react";
import { readFavorites, writeFavorites } from "../lib/storage";
import type { Meal } from "../types/meal";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Meal[]>(() => readFavorites<Meal>());

  const isFavorite = useCallback(
    (id: string) => favorites.some((meal) => meal.idMeal === id),
    [favorites],
  );

  const toggle = useCallback((meal: Meal) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.idMeal === meal.idMeal);
      const next = exists
        ? current.filter((item) => item.idMeal !== meal.idMeal)
        : [meal, ...current];
      writeFavorites(next);
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggle };
}
