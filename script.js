// ==========================================
// GET ELEMENTS
// ==========================================

const emailInput = document.getElementById("email");
const getStarted = document.getElementById("getStarted");
const language = document.querySelector("select");
const accordions = document.querySelectorAll(".accordion");
const movieCards = document.querySelectorAll(".movie-card");

// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = ".5s";

        document.body.style.opacity = "1";

    }, 100);

    emailInput.focus();

});

// ==========================================
// GET STARTED
// ==========================================

getStarted.addEventListener("click", () => {

    const email = emailInput.value.trim();

    if (email === "") {

        alert("Please enter your email address.");

        emailInput.focus();

        return;

    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        emailInput.focus();

        return;

    }

    // Save email for signup page

    localStorage.setItem("userEmail", email);

    // Redirect

    window.location.href = "signup.html";

});

// ==========================================
// ENTER KEY SUPPORT
// ==========================================

emailInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        getStarted.click();

    }

});

// ==========================================
// FAQ ACCORDION
// ==========================================

accordions.forEach(button => {

    button.addEventListener("click", function () {

        this.classList.toggle("active");

        const panel = this.nextElementSibling;

        if (panel.style.maxHeight) {

            panel.style.maxHeight = null;

        }

        else {

            panel.style.maxHeight = panel.scrollHeight + "px";

        }

    });

});

// ==========================================
// LANGUAGE SELECT
// ==========================================

language.addEventListener("change", () => {

    alert("Language changed to " + language.value);

});

// ==========================================
// MOVIE HOVER EFFECT
// ==========================================

movieCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "scale(1.08)";

        card.style.transition = ".3s";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "scale(1)";

    });

});

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// ==========================================
// NAVBAR SHADOW
// ==========================================

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 40) {

        navbar.style.background = "rgba(0,0,0,.95)";

        navbar.style.boxShadow = "0 3px 12px rgba(0,0,0,.6)";

    }

    else {

        navbar.style.background = "transparent";

        navbar.style.boxShadow = "none";

    }

});