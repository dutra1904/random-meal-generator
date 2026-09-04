export function MealSkeleton() {
  return (
    <div className="article article--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="article__body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
        <div className="skeleton skeleton--block" />
      </div>
    </div>
  );
}
