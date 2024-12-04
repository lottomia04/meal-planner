// Store meals and users in localStorage
let usersMeals = JSON.parse(localStorage.getItem('usersMeals')) || {};

let currentUser = "";

// Handle login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get username
    currentUser = document.getElementById('username').value;
    if (currentUser) {
        // Check if user exists in localStorage, otherwise create a new entry
        if (!usersMeals[currentUser]) {
            usersMeals[currentUser] = [];
        }

        // Save the current user and their meal data in localStorage
        localStorage.setItem('usersMeals', JSON.stringify(usersMeals));

        // Hide login form and show meal planner
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('meal-planner').style.display = 'block';

        // Update meal log and shopping list for the current user
        updateMealLog();
        updateShoppingList();
    }
});

// Log a meal for the current user
document.getElementById('meal-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const mealName = document.getElementById('meal-name').value;
    const ingredients = document.getElementById('meal-ingredients').value.split(',');

    // Add meal to the current user's meal log
    usersMeals[currentUser].push({ name: mealName, ingredients });

    // Save to localStorage
    localStorage.setItem('usersMeals', JSON.stringify(usersMeals));

    // Update the log and shopping list
    updateMealLog();
    updateShoppingList();

    // Clear form
    document.getElementById('meal-form').reset();
});

// Update meal log for the current user
function updateMealLog() {
    const mealLog = document.getElementById('meal-log');
    mealLog.innerHTML = usersMeals[currentUser]
        .map((meal) => `<li>${meal.name}: ${meal.ingredients.join(', ')}</li>`)
        .join('');
}

// Update shopping list based on the current user's meals
function updateShoppingList() {
    const shoppingList = document.getElementById('shopping-list');
    const allIngredients = usersMeals[currentUser].flatMap((meal) => meal.ingredients);
    const uniqueIngredients = [...new Set(allIngredients)];

    shoppingList.innerHTML = uniqueIngredients.map((item) => `<li>${item}</li>`).join('');
}

// Clear the shopping list when the button is clicked
document.getElementById('clear-list-btn').addEventListener('click', () => {
    const shoppingList = document.getElementById('shopping-list');
    shoppingList.innerHTML = '';
});
