# Mesa · Random Meal Generator

App em **React + TypeScript** que sugere uma receita na hora — com filtros, favoritos e o fluxo completo da [TheMealDB](https://www.themealdb.com/api.php).

**Demo:** [dutra1904.github.io/random-meal-generator](https://dutra1904.github.io/random-meal-generator/)

## Demonstração

![Random Meal Generator exibindo uma receita com foto, ingredientes e interface escura](https://github.com/user-attachments/assets/9c006be4-3fa2-4763-9a82-4725564f9f1d)

## Funcionalidades

- Gerar receita aleatória, evitando repetir a anterior
- Filtrar por categoria e culinária (os dois ao mesmo tempo, quando possível)
- Salvar favoritas no `localStorage` e reabrir sem nova busca
- Copiar lista de ingredientes
- Vídeo do YouTube, fonte oficial e tags da API
- Skeleton de loading, erro com retry e última receita restaurada no reload

## Tecnologias

- React 19
- TypeScript
- Vite
- Vitest
- [TheMealDB API](https://www.themealdb.com/api.php)

## Como executar

```bash
git clone https://github.com/dutra1904/random-meal-generator.git
cd random-meal-generator
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (com o base path `/random-meal-generator/`).

```bash
npm test
npm run build
```

## Como funciona

1. `useMealExplorer` decide entre `/random.php`, `/filter.php` e `/lookup.php`.
2. Categoria + culinária: busca a lista, abre alguns IDs em paralelo e fica com o primeiro que casa os dois.
3. Favoritas e a última receita ficam no navegador.
4. Ingredientes e o ID do YouTube passam por funções testadas. O React escapa o texto da API.

---

Feito por [Maria Clara Dutra](https://github.com/dutra1904)
