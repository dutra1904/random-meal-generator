import { useEffect } from "react";
import type { Meal } from "../types/meal";

type FavoritesDrawerProps = {
  open: boolean;
  favorites: Meal[];
  onClose: () => void;
  onSelect: (meal: Meal) => void;
};

export function FavoritesDrawer({ open, favorites, onClose, onSelect }: FavoritesDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer">
      <button type="button" className="drawer__backdrop" aria-label="Fechar favoritas" onClick={onClose} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="favorites-title">
        <div className="drawer__head">
          <h2 id="favorites-title">Favoritas</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
        {favorites.length === 0 ? (
          <p className="drawer__empty">Nenhuma receita salva ainda. Gere uma e clique em salvar.</p>
        ) : (
          <ul className="fav-list">
            {favorites.map((meal) => (
              <li key={meal.idMeal}>
                <button
                  type="button"
                  className="fav-card"
                  onClick={() => {
                    onSelect(meal);
                    onClose();
                  }}
                >
                  <img src={meal.strMealThumb} alt="" width={72} height={72} />
                  <span>
                    <strong>{meal.strMeal}</strong>
                    <small>{[meal.strCategory, meal.strArea].filter(Boolean).join(" · ")}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
