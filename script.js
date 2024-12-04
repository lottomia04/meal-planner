// Global Variables
const users = {};
let currentUser = null;

// Login Function
function login() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter a valid username.");
        return;
    }

    currentUser = username;
    if (!users[username]) {
        users[username] = { meals: [], shoppingList: [] };
    }

    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;

    renderMeals();
    renderShoppingList();
}

// Logout Function
function logout() {
    currentUser = null;
    document.getElementById("main-app").style.display = "none";
    document.getElementById("login-page").style.display = "block";
    document.getElementById("username").value = "";
}

// Add Meal
function addMeal() {
    const mealName = document.getElementById("meal-name").value.trim();
    const ingredients = document.getElementById("meal-ingredients").value.trim();

    if (!mealName || !ingredients) {
        alert("Please enter a meal name and ingredients.");
        return;
    }

    const ingredientList = ingredients.split(",").map(item => item.trim());
    users[currentUser].meals.push({ name: mealName, ingredients: ingredientList });
    users[currentUser].shoppingList.push(...ingredientList);

    document.getElementById("meal-name").value = "";
    document.getElementById("meal-ingredients").value = "";

    renderMeals();
    renderShoppingList();
}

// Render Meals
function renderMeals() {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = "";
    users[currentUser].meals.forEach(meal => {
        const li = document.createElement("li");
        li.innerText = `${meal.name} (Ingredients: ${meal.ingredients.join(", ")})`;
        mealList.appendChild(li);
    });
}

// Render Shopping List
function renderShoppingList() {
    const shoppingList = document.getElementById("shopping-list");
    shoppingList.innerHTML = "";
    users[currentUser].shoppingList.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        shoppingList.appendChild(li);
    });
}

// Clear Shopping List
function clearShoppingList() {
    users[currentUser].shoppingList = [];
    renderShoppingList();
}
