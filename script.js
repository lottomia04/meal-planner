let currentUser = null;
let mealLog = [];
let shoppingList = [];

// Initialize when the page loads
function checkLoggedInUser() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    if (loggedInUsername) {
        currentUser = loggedInUsername;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('account-section').style.display = 'block';
        document.getElementById('current-username').textContent = currentUser;
        loadMealLog();
        loadShoppingList();
    }
}

// Login functionality
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            currentUser = username;
            localStorage.setItem('loggedInUsername', username);
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('account-section').style.display = 'block';
            document.getElementById('current-username').textContent = currentUser;
            loadMealLog();
            loadShoppingList();
        } else {
            alert('Invalid username or password!');
        }
    } else {
        alert('Please enter both username and password!');
    }
}

// Account creation functionality
function createAccount() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        const existingUser = localStorage.getItem(username);
        if (existingUser) {
            alert('Account already exists!');
        } else {
            const newUser = { username, password, meals: [], shoppingList: [] };
            localStorage.setItem(username, JSON.stringify(newUser));
            alert('Account created successfully!');
        }
    } else {
        alert('Please enter both username and password!');
    }
}

// Add a new meal to the meal log
function addMeal() {
    const mealName = document.getElementById('meal-name').value;
    if (mealName && currentUser) {
        mealLog.push({ name: mealName, user: currentUser });
        updateMealLog();
        updateUserData();
    }
}

// Load meal log from localStorage
function loadMealLog() {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    mealLog = userData ? userData.meals : [];
    updateMealLog();
}

// Update the meal log displayed on the page
function updateMealLog() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';
    mealLog.forEach(meal => {
        const li = document.createElement('li');
        li.textContent = meal.name;
        li.classList.add('meal-item');
        mealList.appendChild(li);
    });
}

// Clear the shopping list
function clearShoppingList() {
    shoppingList = [];
    updateShoppingList();
    updateUserData();
}

// Load shopping list from localStorage
function loadShoppingList() {
    const userData = JSON.parse(localStorage.getItem(currentUser));
    shoppingList = userData ? userData.shoppingList : [];
    updateShoppingList();
}

// Update the shopping list displayed on the page
function updateShoppingList() {
    const shoppingListElement = document.getElementById('shopping-list');
    shoppingListElement.innerHTML = '';
    shoppingList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        shoppingListElement.appendChild(li);
    });
}

// Delete the user account
function deleteAccount() {
    const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmation) {
        localStorage.removeItem(currentUser);
        localStorage.removeItem('loggedInUsername');
        alert('Your account has been deleted.');
        window.location.reload();
    }
}

// Update user data in localStorage
function updateUserData() {
    const userData = {
        username: currentUser,
        password: JSON.parse(localStorage.getItem(currentUser)).password,
        meals: mealLog,
        shoppingList: shoppingList,
    };
    localStorage.setItem(currentUser, JSON.stringify(userData));
}

// Initialize login state
checkLoggedInUser();
