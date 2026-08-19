// ==========================================
// LOGIN CHECK
// ==========================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// ==========================================
// ELEMENTS
// ==========================================

const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("searchInput");
const category = document.getElementById("category");

// ==========================================
// EVENT DELEGATION
// ==========================================

document.addEventListener("click", function (e) {
    const card = e.target.closest(".movie-card");
    if (!card) return;
    const id = card.dataset.id;
    if (id) {
        window.location.href = "movie.html?id=" + encodeURIComponent(id);
    }
});

// ==========================================
// LOAD MOVIES
// ==========================================

displayMovies(movies);

// ==========================================
// DISPLAY MOVIES
// ==========================================

function displayMovies(movieArray) {

    movieGrid.innerHTML = "";

    if (!movieArray || movieArray.length === 0) {

        movieGrid.innerHTML = `
        <h2 style="
            grid-column:1/-1;
            text-align:center;
            color:#999;
            margin-top:50px;
        ">
            No movies found.
        </h2>
        `;

        return;
    }

    movieArray.forEach(movie => {

        movieGrid.innerHTML += `
        <div class="movie-card" data-id="${movie.id}" style="cursor:pointer">
            <img src="${movie.image}" alt="${movie.title}" style="pointer-events:none">
            <p>${movie.title}</p>
        </div>
        `;

    });

}

// ==========================================
// SEARCH + CATEGORY FILTER
// ==========================================

function filterMovies() {

    const search = searchInput.value.trim().toLowerCase();
    const selected = category.value;

    const filtered = movies.filter(movie => {

        const matchTitle = movie.title.toLowerCase().includes(search);
        const matchGenre = (movie.genre || "").toLowerCase().includes(search);
        const matchCategory =
            selected === "all" ||
            movie.category === selected;

        return (matchTitle || matchGenre) && matchCategory;

    });

    displayMovies(filtered);

}

searchInput.addEventListener("keyup", filterMovies);
category.addEventListener("change", filterMovies);

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        this.value = "";
        filterMovies();
    }
});

window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = ".4s";
        document.body.style.opacity = "1";
        if (searchInput) searchInput.focus();
    }, 100);
});
