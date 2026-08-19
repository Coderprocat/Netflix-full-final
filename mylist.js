// ==========================================
// LOGIN CHECK
// ==========================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// ==========================================
// ELEMENTS
// ==========================================

const myListGrid = document.getElementById("myListGrid");

if (!myListGrid) {
    throw new Error("myListGrid element not found.");
}

// ==========================================
// LOAD MY LIST (per-user)
// ==========================================

loadMyList();

function loadMyList() {

    let myList = [];

    if (typeof getMyList === "function") {
        myList = getMyList();
    } else {
        // Fallback
        myList = JSON.parse(localStorage.getItem("myList")) || [];
    }

    myListGrid.innerHTML = "";

    // Empty List
    if (myList.length === 0) {

        myListGrid.innerHTML = `
        <div class="empty">
            <i class="fa-solid fa-heart-crack"></i>
            <h2>Your My List is Empty</h2>
            <p>Add your favourite movies to watch later.</p>
        </div>
        `;

        return;
    }

    // Number of Movies
    myListGrid.innerHTML += `
        <div style="
            grid-column:1/-1;
            color:#bbb;
            margin-bottom:20px;
            font-size:18px;
        ">
            ${myList.length} movie${myList.length > 1 ? "s" : ""} in your list
        </div>
    `;

    // Display Movies
    myList.forEach(movie => {

        myListGrid.innerHTML += `
        <div class="movie-card" data-id="${movie.id}">
            <button class="remove-btn" data-id="${movie.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
            <img src="${movie.image}" alt="${movie.title}">
            <p>${movie.title}</p>
        </div>
        `;

    });

    attachMovieEvents();
    attachRemoveEvents();

}

// ==========================================
// OPEN MOVIE
// ==========================================

function attachMovieEvents() {

    document.querySelectorAll(".movie-card").forEach(card => {

        card.addEventListener("click", function (e) {

            if (e.target.closest(".remove-btn")) return;

            window.location.href = `movie.html?id=${this.dataset.id}`;

        });

    });

}

// ==========================================
// REMOVE MOVIE (per-user)
// ==========================================

function attachRemoveEvents() {

    document.querySelectorAll(".remove-btn").forEach(button => {

        button.addEventListener("click", function () {

            const id = Number(this.dataset.id);

            let myList = [];

            if (typeof getMyList === "function") {
                myList = getMyList();
            } else {
                myList = JSON.parse(localStorage.getItem("myList")) || [];
            }

            const movie = myList.find(item => item.id === id);

            if (!movie || !confirm(`Remove "${movie.title}" from My List?`)) {
                return;
            }

            myList = myList.filter(item => item.id !== id);

            if (typeof setMyList === "function") {
                setMyList(myList);
            } else {
                localStorage.setItem("myList", JSON.stringify(myList));
            }

            loadMyList();

        });

    });

}

// ==========================================
// PAGE FADE
// ==========================================

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {
        document.body.style.transition = ".4s";
        document.body.style.opacity = "1";
    }, 100);

});
