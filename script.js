// Helper functions to load and save data from/to localStorage
function loadData() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const meals = JSON.parse(localStorage.getItem('meals')) || {};
    return { users, meals };
}

function saveData(users, meals) {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('meals', JSON.stringify(meals));
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
        saveData(users, loadData().meals);
        alert("Account created! Please log in.");
    }
}

// Handle adding meals to the meal log and shopping list
document.getElementById("add-meal").addEventListener("click", addMeal);
document.getElementById("clear-shopping-list").addEventListener("click", clearShoppingList);

function addMeal() {
    const mealName = document.getElementById("meal-name").value;
    const ingredients = document.getElementById("meal-ingredients").value.split(",").map(item => item.trim());

    const { users, meals } = loadData();

    // Add meal for the current user
    if (currentUser) {
        users[currentUser].meals.push({ name: mealName, ingredients, addedBy: currentUser });
        meals[mealName] = { ingredients };
        saveData(users, meals);
    }

    renderMeals();
    renderShoppingList();
}

function renderMeals() {
    const { users } = loadData();
    const mealLogDiv = document.getElementById("meal-log");
    mealLogDiv.innerHTML = ""; // Clear existing meal log

    // Display each meal as a button
    Object.keys(users).forEach(user => {
        users[user].meals.forEach(meal => {
            const mealButton = document.createElement("button");
            mealButton.textContent = `${meal.name} (Added by: ${meal.addedBy})`;
            mealButton.onclick = () => addIngredientsToShoppingList(meal.ingredients);
            mealLogDiv.appendChild(mealButton);

            // Add a delete button for each meal
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteMeal(meal.name);
            mealLogDiv.appendChild(deleteButton);
        });
    });
}

function addIngredientsToShoppingList(ingredients) {
    const { users } = loadData();
    const shoppingListDiv = document.getElementById("shopping-list");
    
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        shoppingListDiv.appendChild(li);
    });
}

function deleteMeal(mealName) {
    const { users, meals } = loadData();

    if (currentUser) {
        // Remove meal from current user
        users[currentUser].meals = users[currentUser].meals.filter(meal => meal.name !== mealName);
        delete meals[mealName]; // Remove from global meals

        saveData(users, meals);
        renderMeals();
        renderShoppingList();
    }
}

function renderShoppingList() {
    const { users } = loadData();
    const shoppingListDiv = document.getElementById("shopping-list");
    shoppingListDiv.innerHTML = ""; // Clear existing shopping list

    // Merge all ingredients from the logged-in user's meals
    let allIngredients = [];
    users[currentUser].meals.forEach(meal => {
        allIngredients = [...allIngredients, ...meal.ingredients];
    });

    // Display ingredients in shopping list
    allIngredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        shoppingListDiv.appendChild(li);
    });
}

function clearShoppingList() {
    const { users, meals } = loadData();
    if (currentUser) {
        users[currentUser].shoppingList = []; // Clear shopping list for the current user
        saveData(users, meals);
        renderShoppingList();
    }
}
