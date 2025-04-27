async function searchRecipes() {
    const ingredient = document.getElementById('ingredientInput').value.trim();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
  
    if (ingredient === '') {
      alert('Please enter an ingredient!');
      return;
    }
  
    // Show Loading...
    recipesDiv.innerHTML = '<p class="loading">Loading recipes...</p>';
  
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
  
    recipesDiv.innerHTML = ''; // Clear loading message
  
    if (data.meals) {
      data.meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
        `;
  
        recipeCard.addEventListener('click', () => {
          getRecipeDetails(meal.idMeal);
        });
  
        recipesDiv.appendChild(recipeCard);
      });
    } else {
      recipesDiv.innerHTML = '<p>No recipes found 😥</p>';
    }
  }
  
  async function getRecipeDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
  
    document.getElementById('modalTitle').textContent = meal.strMeal;
    document.getElementById('modalImage').src = meal.strMealThumb;
  
    // Prepare Ingredients List
    let ingredientsList = '<h3>Ingredients</h3><ul>';
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredientsList += `<li>${measure} ${ingredient}</li>`;
      }
    }
    ingredientsList += '</ul>';
  
    // Prepare Instructions List
    const instructions = meal.strInstructions.split('.').filter(step => step.trim() !== '');
    let stepsList = '<h3>Instructions</h3><ol>';
    instructions.forEach(step => {
      stepsList += `<li>${step.trim()}.</li>`;
    });
    stepsList += '</ol>';
  
    // Set the modal content
    document.getElementById('modalInstructions').innerHTML = ingredientsList + stepsList;
  
    document.getElementById('recipeModal').style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
  }
  