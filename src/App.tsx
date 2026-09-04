import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { FilterBar } from "./components/FilterBar";
import { Hero } from "./components/Hero";
import { MealPanel } from "./components/MealPanel";
import { useFavorites } from "./hooks/useFavorites";
import { useMealExplorer } from "./hooks/useMealExplorer";

export function App() {
  const explorer = useMealExplorer();
  const favorites = useFavorites();
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const hasMeal = Boolean(explorer.meal) && explorer.status === "success";

  return (
    <div className="app">
      <AppHeader
        favoriteCount={favorites.favorites.length}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />
      <main className="shell">
        <Hero
          compact={hasMeal || explorer.status === "loading"}
          isLoading={explorer.status === "loading"}
          onGenerate={() => void explorer.generate()}
        />
        <FilterBar
          filters={explorer.filters}
          categories={explorer.categories}
          areas={explorer.areas}
          onChange={explorer.updateFilter}
        />
        <MealPanel
          meal={explorer.meal}
          status={explorer.status}
          error={explorer.error}
          isFavorite={explorer.meal ? favorites.isFavorite(explorer.meal.idMeal) : false}
          onToggleFavorite={() => {
            if (explorer.meal) favorites.toggle(explorer.meal);
          }}
          onRetry={() => void explorer.generate()}
        />
      </main>
      <footer className="footer">Receitas via TheMealDB</footer>
      <FavoritesDrawer
        open={favoritesOpen}
        favorites={favorites.favorites}
        onClose={() => setFavoritesOpen(false)}
        onSelect={explorer.openMeal}
      />
    </div>
  );
}
