// Global Variables
const users = {}; // Stores users and their data (meals, shopping list)
let currentUser = null; // The user currently logged in

// Login Function: Called when user clicks "Login"
function login() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a valid username.");
        return;
    }

    currentUser = username;

    // If the user does not exist, create them with an empty meal log and shopping list
    if (!users[username]) {
        users[username] = { meals: [], shoppingList: [] };
    }

    // Switch to the main app interface
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;

    renderMeals();
    renderShoppingList();
}

// Logout Function: Logs the user out and switches back to the login page
function logout() {
    currentUser = null;
    document.getElementById("main-app").style.display = "none";
    document.getElementById("login-page").style.display = "block";
    document.getElementById("username").value = "";
}

// Add Meal: Adds a meal and its ingredients to the meal log and shopping list
function addMeal() {
    const mealName = document.getElementById("meal-name").value.trim();
    const ingredients = document.getElementById("meal-ingredients").value.trim();

    if (!mealName || !ingredients) {
        alert("Please enter both meal name and ingredients.");
        return;
    }

    // Split ingredients by commas and clean up extra spaces
    const ingredientList = ingredients.split(",").map(item => item.trim());

    // Add the meal and ingredients to the user's data
    users[currentUser].meals.push({ name: mealName, ingredients: ingredientList });
    users[currentUser].shoppingList.push(...ingredientList); // Add ingredients to shopping list

    // Clear input fields
    document.getElementById("meal-name").value = "";
    document.getElementById("meal-ingredients").value = "";

    renderMeals();
    renderShoppingList();
}

// Render Meals: Displays the list of meals and their ingredients
function renderMeals() {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = ""; // Clear existing meal list

    users[currentUser].meals.forEach(meal => {
        const li = document.createElement("li");
        li.innerText = `${meal.name} (Ingredients: ${meal.ingredients.join(", ")})`;
        mealList.appendChild(li);
    });
}

// Render Shopping List: Displays the shopping list (ingredients)
function renderShoppingList() {
    const shoppingList = document.getElementById("shopping-list");
    shoppingList.innerHTML = ""; // Clear existing shopping list

    users[currentUser].shoppingList.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        shoppingList.appendChild(li);
    });
}

// Clear Shopping List: Clears the shopping list
function clearShoppingList() {
    users[currentUser].shoppingList = []; // Empty the shopping list
    renderShoppingList(); // Re-render the shopping list
}

