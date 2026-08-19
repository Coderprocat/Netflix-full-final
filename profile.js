// ==========================================
// LOGIN CHECK
// ==========================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}


// ==========================================
// DISPLAY REAL USER INFO
// ==========================================

(function showUserInfo() {

    const user = typeof getCurrentUser === "function"
        ? getCurrentUser()
        : null;

    const nameEl = document.getElementById("userName");
    const emailEl = document.getElementById("userEmail");

    if (user) {
        if (nameEl) nameEl.textContent = user.name || "User";
        if (emailEl) emailEl.textContent = user.email || "";
    }

})();


// ==========================================
// GET SAVED MOVIES COUNT (per-user)
// ==========================================

let myList = [];

if (typeof getMyList === "function") {
    myList = getMyList();
} else {
    myList = JSON.parse(localStorage.getItem("myList")) || [];
}

const myListCount = document.getElementById("myListCount");

if (myListCount) {
    myListCount.textContent = myList.length;
}


// ==========================================
// SAVED MOVIES CARD
// ==========================================

const savedMoviesCard = document.getElementById("savedMoviesCard");

if (savedMoviesCard) {
    savedMoviesCard.addEventListener("click", () => {
        window.location.href = "mylist.html";
    });
}


// ==========================================
// SETTINGS
// ==========================================

const settingsCard = document.getElementById("settingsCard");
const settingsOverlay = document.getElementById("settingsOverlay");
const closeSettings = document.getElementById("closeSettings");

if (settingsCard && settingsOverlay) {
    settingsCard.addEventListener("click", () => {
        settingsOverlay.classList.add("show");
    });
}

if (closeSettings && settingsOverlay) {
    closeSettings.addEventListener("click", () => {
        settingsOverlay.classList.remove("show");
    });
}

if (settingsOverlay) {
    settingsOverlay.addEventListener("click", (event) => {
        if (event.target === settingsOverlay) {
            settingsOverlay.classList.remove("show");
        }
    });
}


// ==========================================
// ESC KEY CLOSES SETTINGS
// ==========================================

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsOverlay) {
        settingsOverlay.classList.remove("show");
    }
});


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {
            if (typeof logout === "function") {
                logout();
            } else {
                localStorage.removeItem("loggedIn");
                localStorage.removeItem("currentUser");
                window.location.href = "login.html";
            }
        }

    });
}
