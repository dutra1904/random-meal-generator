const FAVORITES_KEY = "mesa.favorites";
const LAST_MEAL_KEY = "mesa.lastMeal";

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readFavorites<T>(): T[] {
  return readJson<T[]>(FAVORITES_KEY) ?? [];
}

export function writeFavorites<T>(favorites: T[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function readLastMeal<T>(): T | null {
  return readJson<T>(LAST_MEAL_KEY);
}

export function writeLastMeal<T>(meal: T): void {
  localStorage.setItem(LAST_MEAL_KEY, JSON.stringify(meal));
}
