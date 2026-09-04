type HeroProps = {
  compact: boolean;
  isLoading: boolean;
  onGenerate: () => void;
};

export function Hero({ compact, isLoading, onGenerate }: HeroProps) {
  return (
    <section className={compact ? "hero hero--compact" : "hero"}>
      <div className="hero__copy">
        <p className="eyebrow">O que cozinhar agora</p>
        <h1 className="hero__title">Uma receita. Sem decisão.</h1>
        {!compact ? (
          <p className="hero__lead">
            Filtros opcionais, ingredientes, modo de preparo e vídeo — gerado na hora a partir da
            TheMealDB.
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className="btn"
        onClick={onGenerate}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? <span className="btn__loader" aria-hidden="true" /> : null}
        {isLoading ? "Buscando receita…" : compact ? "Outra receita" : "Gerar receita"}
      </button>
    </section>
  );
}
