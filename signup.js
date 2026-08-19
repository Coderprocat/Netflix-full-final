// ==========================
// GET FORM ELEMENTS
// ==========================

const signupForm = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// ==========================
// AUTO FILL EMAIL (from landing page)
// ==========================

const savedEmail = localStorage.getItem("userEmail");

if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
}

// ==========================
// SIGN UP
// ==========================

signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("An account with this email already exists.");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        myList: [],
        continueWatching: [],
        recentlyViewed: []
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", email);
    localStorage.setItem("loggedIn", "true");
    localStorage.removeItem("userEmail");

    // Go to Who's Watching
    window.location.href = "profiles.html";
});

// ==========================
// PAGE FADE ANIMATION
// ==========================

window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = ".4s";
        document.body.style.opacity = "1";
    }, 100);
});
