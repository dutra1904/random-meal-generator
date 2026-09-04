type AppHeaderProps = {
  favoriteCount: number;
  onOpenFavorites: () => void;
};

export function AppHeader({ favoriteCount, onOpenFavorites }: AppHeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__mark" aria-hidden="true" />
        <div>
          <p className="topbar__name">Mesa</p>
          <p className="topbar__tag">Random Meal Generator</p>
        </div>
      </div>
      <button type="button" className="ghost-btn" onClick={onOpenFavorites}>
        Favoritas
        {favoriteCount > 0 ? <span className="count">{favoriteCount}</span> : null}
      </button>
    </header>
  );
}
