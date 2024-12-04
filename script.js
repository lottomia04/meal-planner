// Helper functions to load and save data from/to localStorage
function loadData() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return { users };
}

function saveData(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Handle account login and sign up
document.getElementById("login-button").addEventListener("click", login);
document.getElementById("signup-button").addEventListener("click", signUp);

let currentUser = null; // Store current logged-in user

function login() {
    const { users } = loadData();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("meal-planner-section").style.display = "block";
        renderMeals();
        renderShoppingList();
    } else {
        alert("Invalid username or password");
    }
}

function signUp() {
    const { users } = loadData();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username]) {
        alert("Username already exists.");
    } else {
        users[username] = { password, meals: [], shoppingList: [] };
        saveData(users);
        alert("Account created! Please log in.");
    }
}

// Handle adding meals to the meal log and shopping list
document.getElementById("add-meal").addEventListener("click", addMeal);
document.getElementById("clear-shopping-list").addEventListener("click", clearShoppingList);

function addMeal() {
    const mealName = document.getElementById("meal-name").value;
    const ingredients = document.getElementById("meal-ingredients").value.split(",").map(item => item.trim());

    const { users } = loadData();

    // Validate input
    if (!mealName || !ingredients.length) {
        alert("Please enter both a meal name and ingredients.");
        return;
    }

    // Add meal to the current user’s meal list
    if (currentUser) {
        users[currentUser].meals.push({ name: mealName, ingredients });
        saveData(users);
    }

    renderMeals();  // Refresh the meal log
    renderShoppingList(); // Refresh the shopping list
}

function renderMeals() {
    const { users } = loadData();
    const mealLogDiv = document.getElementById("meal-log");
    mealLogDiv.innerHTML = ""; // Clear existing meal log

    if (currentUser) {
        users[currentUser].meals.forEach(meal => {
            // Create a button for each meal
            const mealButton = document.createElement("button");
            mealButton.textContent = meal.name;
            mealButton.onclick = () => addIngredientsToShoppingList(meal.ingredients);
            mealLogDiv.appendChild(mealButton);

            // Add a delete button for each meal
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteMeal(meal.name);
            mealLogDiv.appendChild(deleteButton);
        });
    }
}

function addIngredientsToShoppingList(ingredients) {
    const shoppingListDiv = document.getElementById("shopping-list");

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        shoppingListDiv.appendChild(li);
    });
}

function deleteMeal(mealName) {
    const { users } = loadData();

    if (currentUser) {
        // Remove meal from the current user's meals
        users[currentUser].meals = users[currentUser].meals.filter(meal => meal.name !== mealName);
        saveData(users);

        renderMeals();  // Refresh the meal log
        renderShoppingList();  // Refresh the shopping list
    }
}

function renderShoppingList() {
    const { users } = loadData();
    const shoppingListDiv = document.getElementById("shopping-list");
    shoppingListDiv.innerHTML = ""; // Clear existing shopping list

    if (currentUser) {
        let allIngredients = [];

        // Gather ingredients from all meals
        users[currentUser].meals.forEach(meal => {
            allIngredients = [...allIngredients, ...meal.ingredients];
        });

        // Display ingredients in the shopping list
        allIngredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient;
            shoppingListDiv.appendChild(li);
        });
    }
}

function clearShoppingList() {
    const { users } = loadData();
    if (currentUser) {
        users[currentUser].shoppingList = []; // Clear shopping list for the current user
        saveData(users);
        renderShoppingList(); // Refresh the shopping list
    }
}
