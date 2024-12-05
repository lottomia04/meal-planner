let currentUser = null;
let mealLog = [];
let shoppingList = [];

// Check if there's a logged-in user
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

// Handle login
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

// Handle account creation
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

// Handle adding a meal
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

// Update the meal log on the page
function updateMealLog() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';
    mealLog.forEach(meal => {
        const li = document.createElement('li');
        li.textContent = meal.name;
        li.classList.add('meal-item');
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('meal', meal.name);
        });
        mealList.appendChild(li);
    });
}

// Handle clearing shopping list
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

// Update the shopping list on the page
function updateShoppingList() {
    const shoppingListElement = document.getElementById('shopping-list');
    shoppingListElement.innerHTML = '';
    shoppingList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        shoppingListElement.appendChild(li);
    });
}

// Handle drag-and-drop for the calendar
function handleDrop(event) {
    event.preventDefault();
    const mealName = event.dataTransfer.getData('meal');
    const day = event.target.getAttribute('data-day');
    
    if (mealName && day) {
        shoppingList.push(mealName);
        updateShoppingList();
        updateUserData();
        alert(`Added ${mealName} to ${day} and shopping list.`);
    }
}

// Create and initialize the calendar
function initCalendar() {
    $('#calendar').fullCalendar({
        droppable: true, // Enable drag and drop
        drop: handleDrop,
    });
}

// Delete user account
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

// Call checkLoggedInUser when the page loads
checkLoggedInUser();
initCalendar();

