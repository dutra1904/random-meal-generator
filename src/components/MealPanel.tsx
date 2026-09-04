import type { Meal, RequestStatus } from "../types/meal";
import { MealArticle } from "./MealArticle";
import { MealSkeleton } from "./MealSkeleton";

type MealPanelProps = {
  meal: Meal | null;
  status: RequestStatus;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRetry: () => void;
};

export function MealPanel({
  meal,
  status,
  error,
  isFavorite,
  onToggleFavorite,
  onRetry,
}: MealPanelProps) {
  return (
    <section className="stage" aria-live="polite" aria-atomic="true">
      {status === "idle" ? (
        <p className="muted-note">Escolha um filtro se quiser, e gere a primeira receita.</p>
      ) : null}

      {status === "loading" ? <MealSkeleton /> : null}

      {status === "error" ? (
        <div className="error" role="alert">
          <p>{error}</p>
          <button type="button" className="ghost-btn" onClick={onRetry}>
            Tentar de novo
          </button>
        </div>
      ) : null}

      {status === "success" && meal ? (
        <MealArticle meal={meal} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
      ) : null}
    </section>
  );
}
