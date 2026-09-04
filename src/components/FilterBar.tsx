import type { MealFilters } from "../types/meal";

type FilterBarProps = {
  filters: MealFilters;
  categories: string[];
  areas: string[];
  onChange: (key: keyof MealFilters, value: string) => void;
};

export function FilterBar({ filters, categories, areas, onChange }: FilterBarProps) {
  return (
    <section className="filters" aria-label="Filtros da receita">
      <label className="field">
        <span className="field__label">Categoria</span>
        <select
          className="field__control"
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option value="">Qualquer</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field__label">Culinária</span>
        <select
          className="field__control"
          value={filters.area}
          onChange={(event) => onChange("area", event.target.value)}
        >
          <option value="">Qualquer</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
