import { useState } from "react";
import { parseIngredients } from "../lib/ingredients";
import { splitInstructions } from "../lib/instructions";
import { parseTags } from "../lib/tags";
import { isSafeHttpUrl } from "../lib/url";
import { extractYoutubeVideoId } from "../lib/youtube";
import type { Meal } from "../types/meal";

type MealArticleProps = {
  meal: Meal;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function MealArticle({ meal, isFavorite, onToggleFavorite }: MealArticleProps) {
  const ingredients = parseIngredients(meal);
  const instructions = splitInstructions(meal.strInstructions);
  const videoId = extractYoutubeVideoId(meal.strYoutube);
  const tags = parseTags(meal.strTags);
  const source = isSafeHttpUrl(meal.strSource) ? meal.strSource : null;
  const [copied, setCopied] = useState(false);

  async function copyIngredients() {
    const text = ingredients.map((item) => item.display).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="article">
      <img
        className="article__image"
        src={meal.strMealThumb}
        alt={`Foto da receita: ${meal.strMeal}`}
        width={700}
        height={700}
      />
      <div className="article__body">
        <div className="chips">
          {meal.strCategory ? <span className="chip">{meal.strCategory}</span> : null}
          {meal.strArea ? <span className="chip">{meal.strArea}</span> : null}
          {tags.map((tag) => (
            <span key={tag} className="chip chip--mute">
              {tag}
            </span>
          ))}
        </div>
        <h2 className="article__title">{meal.strMeal}</h2>
        <div className="article__actions">
          <button type="button" className="ghost-btn" onClick={onToggleFavorite}>
            {isFavorite ? "Salva nos favoritos" : "Salvar favorita"}
          </button>
          <button type="button" className="ghost-btn" onClick={() => void copyIngredients()}>
            {copied ? "Ingredientes copiados" : "Copiar ingredientes"}
          </button>
          {source ? (
            <a className="ghost-btn ghost-btn--link" href={source} target="_blank" rel="noreferrer">
              Fonte
            </a>
          ) : null}
        </div>
        <h3 className="section-title">Ingredientes</h3>
        <ul className="ingredients">
          {ingredients.map((ingredient, index) => (
            <li key={`${ingredient.name}-${index}`}>
              <span>{ingredient.name}</span>
              <span>{ingredient.measure}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="article__method">
        <h3 className="section-title">Modo de preparo</h3>
        <ol className={instructions.length > 1 ? "steps" : "steps steps--single"}>
          {instructions.map((step, index) => (
            <li key={`${index}-${step.slice(0, 24)}`}>{step}</li>
          ))}
        </ol>
        {videoId ? (
          <>
            <h3 className="section-title">Vídeo</h3>
            <div className="video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`Vídeo da receita: ${meal.strMeal}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}
