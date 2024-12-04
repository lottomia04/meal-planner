// Global Variables
let currentUser = null; // Current logged-in user

// Load data from localStorage (if any)
function loadData() {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || {};
    const savedMeals = JSON.parse(localStorage.getItem("meals")) || {};
    return { savedUsers, savedMeals };
}

// Store data to localStorage
function saveData(users, meals) {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("meals", JSON.stringify(meals));
}

// Show the login page and hide others
function showLoginPage() {
    document.getElementById("login-page").style.display = "block";
    document.getElementById("register-page").style.display = "none";
    document.getElementById("main-app").style.display = "none";
}

// Show the registration page and hide others
function showRegisterPage() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("register-page").style.display = "block";
    document.getElementById("main-app").style.display = "none";
}

// Login Function
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const { savedUsers, savedMeals } = loadData();

    // Check if the user exists and the password is correct
    if (savedUsers[username] && savedUsers[username].password === password) {
        currentUser = username;
        document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;
        document.getElementById("login-page").style.display = "none";
        document.getElementById("main-app").style.display = "block";
        renderMeals(savedMeals);
        renderShoppingList(savedMeals);
    } else {
        alert("Invalid username or password.");
    }
}

// Logout Function
function logout() {
    currentUser = null;
    showLoginPage();
}

// Create Account Function
function createAccount() {
    const newUsername = document.getElementById("new-username").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const { savedUsers, savedMeals } = loadData();

    // Check if the username already exists
    if (savedUsers[newUsername]) {
        alert("Username already taken.");
        return;
    }

    // Create a new user and save it
    savedUsers[newUsername] = { password: newPassword };
    saveData(savedUsers, savedMeals);

    alert("Account created successfully!");
    showLoginPage();
}

// Add Meal Function
function addMeal() {
    const mealName = document.getElementById("meal-name").value.trim();
    const ingredients = document.getElementById("meal-ingredients").value.trim();

    if (!mealName || !ingredients) {
        alert("Please enter both meal name and ingredients.");
        return;
    }

    const ingredientList = ingredients.split(",").map(item => item.trim());
    const { savedUsers, savedMeals } = loadData();

    // If it's the first time for this user, initialize their meal data
    if (!savedMeals[currentUser]) {
        savedMeals[currentUser] = { meals: [], shoppingList: [] };
    }

    savedMeals[currentUser].meals.push({ name: mealName, ingredients: ingredientList, addedBy: currentUser });
    savedMeals[currentUser].shoppingList.push(...ingredientList);

    saveData(savedUsers, savedMeals);

    renderMeals(savedMeals);
    renderShoppingList(savedMeals);
}

// Render Meals Function
function renderMeals(savedMeals) {
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = ""; // Clear existing meals

    // Display meals from all users
    for (const user in savedMeals) {
        savedMeals[user].meals.forEach(meal => {
            const li = document.createElement("li");
            li.innerText = `${meal.name} (Added by: ${meal.addedBy}, Ingredients: ${meal.ingredients.join(", ")})`;
            mealList.appendChild(li);
        });
    }
}

// Render Shopping List Function
function renderShoppingList(savedMeals) {
    const shoppingList = document.getElementById("shopping-list");
    shoppingList.innerHTML = ""; // Clear existing shopping list

    // Combine shopping lists of all users
    const allShoppingList = [];
    for (const user in savedMeals) {
        allShoppingList.push(...savedMeals[user].shoppingList);
    }

    // Remove duplicates and display the shopping list
    const uniqueShoppingList = [...new Set(allShoppingList)];
    uniqueShoppingList.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        shoppingList.appendChild(li);
    });
}

// Clear Shopping List Function
function clearShoppingList() {
    const { savedUsers, savedMeals } = loadData();

    // Reset shopping list for all users
    for (const user in savedMeals) {
        savedMeals[user].shoppingList = [];
    }

    saveData(savedUsers, savedMeals);
    renderShoppingList(savedMeals);
}
