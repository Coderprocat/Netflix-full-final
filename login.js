// ==========================================
// CHECK LOGIN STATUS
// ==========================================

if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "profiles.html";
}

// ==========================================
// GET ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

// ==========================================
// AUTO FILL EMAIL (FROM SIGNUP PAGE)
// ==========================================

const savedEmail = localStorage.getItem("userEmail");

if (savedEmail) {
    email.value = savedEmail;
    password.focus();
}

// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const userEmail = email.value.trim().toLowerCase();
    const userPassword = password.value;

    if (!userEmail || !userPassword) {
        alert("Please enter your email and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u =>
        u.email === userEmail &&
        u.password === userPassword
    );

    if (!user) {
        alert("Invalid Email or Password");
        return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", user.email);
    localStorage.removeItem("userEmail");

    // Go to Who's Watching instead of directly home
    window.location.href = "profiles.html";

});

// ==========================================
// ENTER KEY SUPPORT
// ==========================================

password.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        loginForm.requestSubmit();
    }
});

// ==========================================
// PAGE FADE ANIMATION
// ==========================================

window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = ".4s";
        document.body.style.opacity = "1";
    }, 100);
});
