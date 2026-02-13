/**
 * Random Meal Generator
 * Aplica padrões de programação profissional: constantes, funções puras e tratamento de erros.
 * @see https://www.themealdb.com/api.php
 */

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const INGREDIENTS_LIMIT = 20;

/** @typedef {Object} Meal
 *  @property {string} strMeal - Nome da refeição
 *  @property {string} strMealThumb - URL da imagem
 *  @property {string} strInstructions - Instruções de preparo
 *  @property {string} [strYoutube] - URL do vídeo YouTube
 */

/** @typedef {Object} MealApiResponse
 *  @property {Meal[]} meals - Array de refeições
 */

/**
 * Extrai o ID do vídeo do YouTube de uma URL ou embed.
 * Suporta: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 * @param {string} url - URL ou embed do YouTube
 * @returns {string|null} ID do vídeo ou null
 */
function extractYoutubeVideoId(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match) return match[1];
    }
    return trimmed.length === 11 ? trimmed : null;
}

/**
 * Extrai ingredientes e medidas de um objeto meal da API.
 * @param {Meal} meal - Objeto meal da TheMealDB
 * @returns {Array<{name: string, measure: string}>}
 */
function parseIngredients(meal) {
    return Array.from({ length: INGREDIENTS_LIMIT }, (_, i) => i + 1)
        .map((i) => ({
            name: meal[`strIngredient${i}`]?.trim(),
            measure: meal[`strMeasure${i}`]?.trim() || '',
        }))
        .filter(({ name }) => Boolean(name))
        .map(({ name, measure }) => ({
            name,
            measure,
            display: measure ? `${name} – ${measure}` : name,
        }));
}

/**
 * Formata instruções com quebras de linha preservadas.
 * @param {string} instructions - Texto bruto das instruções
 * @returns {string} HTML seguro
 */
function formatInstructions(instructions) {
    if (!instructions) return '';
    return instructions
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .map((line) => `<p class="meal__instruction-step">${escapeHtml(line.trim())}</p>`)
        .join('');
}

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Busca uma refeição aleatória da API.
 * @returns {Promise<Meal>}
 * @throws {Error} Quando a API falha ou retorna vazio
 */
async function fetchRandomMeal() {
    const response = await fetch(`${API_BASE_URL}/random.php`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = /** @type {MealApiResponse} */ (await response.json());
    const meal = data?.meals?.[0];
    if (!meal) {
        throw new Error('Nenhuma refeição retornada pela API');
    }
    return meal;
}

/**
 * Renderiza o card da refeição no DOM.
 * @param {HTMLElement} container
 * @param {Meal} meal
 */
function renderMeal(container, meal) {
    const ingredients = parseIngredients(meal);
    const videoId = extractYoutubeVideoId(meal.strYoutube);
    const instructionsHtml = formatInstructions(meal.strInstructions);

    const ingredientsList = ingredients
        .map(({ display }) => `<li class="meal__ingredient">${escapeHtml(display)}</li>`)
        .join('');

    const videoSection = videoId
        ? `
            <h3 class="meal__section-title">Vídeo da Receita</h3>
            <div class="meal__video-wrapper">
                <iframe
                    class="meal__video"
                    src="https://www.youtube.com/embed/${videoId}"
                    title="Vídeo da receita: ${escapeHtml(meal.strMeal)}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
        `
        : '';

    container.innerHTML = `
        <article class="meal__card">
            <h2 class="meal__name">${escapeHtml(meal.strMeal)}</h2>
            <img
                class="meal__image"
                src="${escapeHtml(meal.strMealThumb)}"
                alt="Foto da receita: ${escapeHtml(meal.strMeal)}"
                loading="lazy"
                width="600"
                height="400"
            >
            <h3 class="meal__section-title">Ingredientes</h3>
            <ul class="meal__ingredients">${ingredientsList}</ul>
            <h3 class="meal__section-title">Modo de Preparo</h3>
            <div class="meal__instructions">${instructionsHtml}</div>
            ${videoSection}
        </article>
    `;
    container.classList.add('meal--loaded');
}

/**
 * Renderiza mensagem de erro no container.
 * @param {HTMLElement} container
 * @param {string} message
 */
function renderError(container, message) {
    container.innerHTML = `
        <div class="meal__error" role="alert">
            <p class="meal__error-text">${escapeHtml(message)}</p>
            <p class="meal__error-hint">Verifique sua conexão e tente novamente.</p>
        </div>
    `;
    container.classList.remove('meal--loaded');
}

/**
 * Alterna estado de loading do botão.
 * @param {HTMLButtonElement} button
 * @param {boolean} isLoading
 */
function setButtonLoading(button, isLoading) {
    button.disabled = isLoading;
    button.setAttribute('aria-busy', String(isLoading));
    button.querySelector('.btn__text').hidden = isLoading;
    button.querySelector('.btn__loader').hidden = !isLoading;
}

/**
 * Inicializa a aplicação e configura os event listeners.
 */
function init() {
    const button = /** @type {HTMLButtonElement} */ (
        document.getElementById('btn-random-meal')
    );
    const container = /** @type {HTMLElement} */ (
        document.getElementById('meal-container')
    );

    if (!button || !container) {
        console.error('Elementos necessários não encontrados no DOM');
        return;
    }

    button.addEventListener('click', async () => {
        setButtonLoading(button, true);
        container.classList.remove('meal--loaded');
        container.innerHTML = '<p class="meal__loading">Carregando receita…</p>';

        try {
            const meal = await fetchRandomMeal();
            renderMeal(container, meal);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao carregar a receita';
            console.error('[Random Meal]', error);
            renderError(container, message);
        } finally {
            setButtonLoading(button, false);
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
