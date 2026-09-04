import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAreas, fetchCategories, fetchMealByFilters } from "../api/meals";
import { readLastMeal, writeLastMeal } from "../lib/storage";
import type { Meal, MealFilters, RequestStatus } from "../types/meal";

const EMPTY_FILTERS: MealFilters = { category: "", area: "" };

export function useMealExplorer() {
  const [meal, setMeal] = useState<Meal | null>(() => readLastMeal<Meal>());
  const [status, setStatus] = useState<RequestStatus>(() =>
    readLastMeal<Meal>() ? "success" : "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MealFilters>(EMPTY_FILTERS);
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([fetchCategories(controller.signal), fetchAreas(controller.signal)])
      .then(([nextCategories, nextAreas]) => {
        setCategories(nextCategories);
        setAreas(nextAreas);
      })
      .catch((cause) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        console.error("[Mesa] filtros", cause);
      });

    return () => {
      controller.abort();
      abortRef.current?.abort();
    };
  }, []);

  const generate = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);

    try {
      const nextMeal = await fetchMealByFilters(filters, {
        excludeId: meal?.idMeal,
        signal: controller.signal,
      });
      setMeal(nextMeal);
      setStatus("success");
      writeLastMeal(nextMeal);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        return;
      }

      setError(cause instanceof Error ? cause.message : "Erro ao carregar a receita");
      setStatus("error");
      console.error("[Mesa]", cause);
    }
  }, [filters, meal?.idMeal]);

  const openMeal = useCallback((nextMeal: Meal) => {
    setMeal(nextMeal);
    setStatus("success");
    setError(null);
    writeLastMeal(nextMeal);
  }, []);

  const updateFilter = useCallback((key: keyof MealFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  return {
    meal,
    status,
    error,
    filters,
    categories,
    areas,
    generate,
    openMeal,
    updateFilter,
  };
}
