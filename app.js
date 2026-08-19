// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {

    const email = localStorage.getItem("currentUser");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    return users.find(user => user.email === email);

}

// ==========================================
// SAVE CURRENT USER
// ==========================================

function saveCurrentUser(updatedUser) {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(user => user.email === updatedUser.email);

    if (index !== -1) {

        users[index] = updatedUser;

        localStorage.setItem("users", JSON.stringify(users));

    }

}

// ==========================================
// ENSURE USER HAS LIST ARRAYS (migration)
// ==========================================

function ensureUserLists(user) {

    if (!user) return null;

    if (!Array.isArray(user.myList)) user.myList = [];
    if (!Array.isArray(user.continueWatching)) user.continueWatching = [];
    if (!Array.isArray(user.recentlyViewed)) user.recentlyViewed = [];

    return user;

}

// ==========================================
// GET / SET HELPERS FOR LISTS
// ==========================================

function getMyList() {
    const user = ensureUserLists(getCurrentUser());
    return user ? user.myList : [];
}

function setMyList(list) {
    const user = ensureUserLists(getCurrentUser());
    if (!user) return;
    user.myList = list;
    saveCurrentUser(user);
}

function getContinueWatching() {
    const user = ensureUserLists(getCurrentUser());
    return user ? user.continueWatching : [];
}

function setContinueWatching(list) {
    const user = ensureUserLists(getCurrentUser());
    if (!user) return;
    user.continueWatching = list;
    saveCurrentUser(user);
}

function getRecentlyViewed() {
    const user = ensureUserLists(getCurrentUser());
    return user ? user.recentlyViewed : [];
}

function setRecentlyViewed(list) {
    const user = ensureUserLists(getCurrentUser());
    if (!user) return;
    user.recentlyViewed = list;
    saveCurrentUser(user);
}

// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}

// ==========================================
// DISPLAY CURRENT USER NAME
// ==========================================

function displayUserName(selector = ".children-text") {
    const el = document.querySelector(selector);
    if (!el) return;

    const user = getCurrentUser();
    if (user && user.name) {
        el.textContent = user.name.split(" ")[0]; // first name
    } else {
        el.textContent = "User";
    }
}
