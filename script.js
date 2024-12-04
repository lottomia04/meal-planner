// Global Variables
let users = {};
let currentUser = null;

// Login Functionality
function login() {
    const username = document.getElementById("username").value.trim();
    if (username) {
        currentUser = username;
        if (!users[username]) {
            users[username] = { meals: [], shoppingList: [] };
        }
        document.getElementById("login-container").style.display = "none";
        document.getElementById("app-container").style.display = "block";
        document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;
        renderMeals();
        renderShoppingList();
    } else {
        alert("Please enter a valid username.");
    }
}

function logout() {
    currentUser = null;
    document.getElementById("login-container").style.display = "block";
    document.getElementById("app-container").style.display = "none";
    document.getElementById("username").value = "";
}

// Add Meal
function addMeal() {
    const mealName = document.getElementById("meal-name").value.trim();
    const ingredients = document.getElementById("meal-ingredients").value.trim().split(",");
    if (mealName && ingredients.length > 0) {
        users[currentUser].meals.push({ name: mealName, ingredients });
        users[currentUser].shoppingList.push(...ingredients.map(ingredient => ingredient.trim()));
        document.getElementById("meal-name").value = "";
        document.getElementById("meal-ingredients").value = "";
        renderMeals();
        renderShoppingList();
    } else {
        alert("Please enter a meal name and ingredients.");
    }
}

// Render Meals
function renderMeals() {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = "";
    users[currentUser].meals.forEach((meal, index) => {
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

  
