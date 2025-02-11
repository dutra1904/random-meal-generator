document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("button").addEventListener("click", getRandomMeal);
});

async function getRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        const meal = data.meals[0];

        if (!meal) {
            throw new Error("Nenhuma refeição encontrada.");
        }

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            }
        }

        document.getElementById('meal-container').innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>Ingredients</h3>
            <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
            ${meal.strYoutube ? `<h3>Video Recipe</h3><iframe width="100%" height="315" src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}" frameborder="0" allowfullscreen></iframe>` : ''}
        `;
    } catch (error) {
        console.error("Erro ao buscar a refeição:", error);
        document.getElementById('meal-container').innerHTML = "<p>Erro ao carregar a refeição. Tente novamente!</p>";
    }
}
