// ============================================
// LOGIN CHECK
// ============================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}


// ============================================
// GET MOVIE ID FROM URL
// ============================================

const params =
    new URLSearchParams(window.location.search);

const movieId =
    Number(params.get("id"));


// ============================================
// LOAD MOVIE
// movies array comes from movies.js
// ============================================

const movie =
    movies.find(m => m.id === movieId);


// ============================================
// IF MOVIE NOT FOUND
// ============================================

if (!movie || isNaN(movieId)) {

    document.body.innerHTML = `

        <div style="
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #141414;
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        ">

            <h1 style="
                font-size: 3rem;
                margin-bottom: 20px;
            ">
                Movie Not Found
            </h1>

            <p style="
                font-size: 1.2rem;
                color: #aaa;
                margin-bottom: 30px;
            ">
                The movie you are looking for does not exist
                or the link is invalid.
            </p>

            <a href="home.html" style="
                background: #e50914;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                font-size: 1.1rem;
            ">
                Go to Home
            </a>

        </div>

    `;

    throw new Error("Movie not found");
}


// ============================================
// UPDATE PAGE
// ============================================

document.title =
    movie.title + " | Netflix";


document.getElementById("movieTitle").textContent =
    movie.title;


document.getElementById("movieDescription").textContent =
    movie.description;

// Populate the About / Summary section
const summaryEl = document.getElementById("movieSummary");
if (summaryEl) {
    summaryEl.textContent = movie.description;
}


document.getElementById("movieGenre").textContent =
    movie.genre;


document.getElementById("movieYear").textContent =
    movie.year;


document.getElementById("movieDuration").textContent =
    movie.duration;


document.getElementById("movieRating").textContent =
    "★ " + movie.rating;


// ============================================
// EXTRA MOVIE INFORMATION
// ============================================

document.getElementById("extraGenre").textContent =
    movie.genre;


document.getElementById("extraRating").textContent =
    movie.imdb || movie.rating;


document.getElementById("extraYear").textContent =
    movie.year;


document.getElementById("extraDuration").textContent =
    movie.duration;


// ============================================
// HERO BANNER
// ============================================

const banner =
    document.getElementById("movieBanner");


const heroBackground =
    encodeURI(
        movie.banner ||
        movie.image
    );


banner.style.background = `

    linear-gradient(
        rgba(0,0,0,.45),
        rgba(0,0,0,.85)
    ),

    url("${heroBackground}")

`;


banner.style.backgroundSize =
    "cover";


banner.style.backgroundPosition =
    "center";


// ============================================
// 3 SECOND HOVER TRAILER
// ============================================

const bannerTrailer =
    document.getElementById(
        "bannerTrailer"
    );


const bannerTrailerFrame =
    document.getElementById(
        "bannerTrailerFrame"
    );


let trailerTimer = null;


// ============================================
// CONVERT YOUTUBE URL TO EMBED URL
// ============================================

function getYouTubeEmbedUrl(url) {

    if (!url) {
        return null;
    }


    let videoId = null;


    if (url.includes("youtube.com/watch")) {

        const urlObject = new URL(url);
        videoId = urlObject.searchParams.get("v");

    } else if (url.includes("youtu.be/")) {

        videoId = url.split("youtu.be/")[1].split("?")[0];

    } else if (url.includes("youtube.com/embed/")) {

        videoId = url.split("youtube.com/embed/")[1].split("?")[0];

    }


    if (!videoId) {
        return null;
    }


    return `
        https://www.youtube.com/embed/${videoId}
        ?autoplay=1
        &mute=1
        &controls=0
        &loop=1
        &playlist=${videoId}
        &playsinline=1
    `.replace(/\s+/g, "");

}


function startBannerTrailer() {

    if (!movie.trailer) return;

    const embedUrl = getYouTubeEmbedUrl(movie.trailer);

    if (!embedUrl) {
        console.log("Invalid trailer URL:", movie.trailer);
        return;
    }

    bannerTrailerFrame.src = embedUrl;
    bannerTrailer.classList.add("active");

}


function stopBannerTrailer() {

    clearTimeout(trailerTimer);
    bannerTrailer.classList.remove("active");
    bannerTrailerFrame.src = "";

}


banner.addEventListener("mouseenter", () => {

    if (bannerTrailer.classList.contains("active")) return;

    trailerTimer = setTimeout(() => {
        startBannerTrailer();
    }, 3000);

});


banner.addEventListener("mouseleave", () => {
    stopBannerTrailer();
});


// ============================================
// LOAD CAST
// ============================================

const castContainer = document.getElementById("movieCast");

castContainer.innerHTML = "";

if (movie.cast && movie.cast.length > 0) {

    movie.cast.forEach(actor => {

        castContainer.innerHTML += `
            <div class="cast-card">
                ${actor}
            </div>
        `;

    });

} else {

    castContainer.innerHTML = `
        <p style="color:#aaa;">
            Cast information not available
        </p>
    `;

}


// ============================================
// SAVE RECENTLY VIEWED (per-user)
// ============================================

(function saveRecentlyViewed() {

    // Prefer per-user helpers if app.js is loaded
    if (typeof getRecentlyViewed === "function" && typeof setRecentlyViewed === "function") {

        let recent = getRecentlyViewed();

        recent = recent.filter(item => item.id !== movie.id);
        recent.unshift({ id: movie.id, title: movie.title, image: movie.image });

        if (recent.length > 10) recent.pop();

        setRecentlyViewed(recent);

    } else {

        // Fallback to global key (backward compatibility)
        let recentMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
        recentMovies = recentMovies.filter(item => item.id !== movie.id);
        recentMovies.unshift(movie);
        if (recentMovies.length > 10) recentMovies.pop();
        localStorage.setItem("recentMovies", JSON.stringify(recentMovies));

    }

})();


// ============================================
// PLAY BUTTON → also add to Continue Watching
// ============================================

const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", () => {

    // Add to Continue Watching (per-user)
    if (typeof getContinueWatching === "function" && typeof setContinueWatching === "function") {

        let list = getContinueWatching();
        list = list.filter(item => item.id !== movie.id);
        list.unshift({ id: movie.id, title: movie.title, image: movie.image });
        if (list.length > 10) list.pop();
        setContinueWatching(list);

    }

    if (movie.trailer) {
        window.location.href = movie.trailer;
    } else {
        alert("Movie is not available.");
    }

});


// ============================================
// MY LIST (per-user)
// ============================================

const myListBtn = document.getElementById("myListBtn");

function updateButton() {

    let myList = [];

    if (typeof getMyList === "function") {
        myList = getMyList();
    } else {
        myList = JSON.parse(localStorage.getItem("myList")) || [];
    }

    const exists = myList.some(item => item.id === movie.id);

    if (exists) {
        myListBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Added
        `;
    } else {
        myListBtn.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            My List
        `;
    }

}

updateButton();

myListBtn.addEventListener("click", () => {

    let myList = [];

    if (typeof getMyList === "function") {
        myList = getMyList();
    } else {
        myList = JSON.parse(localStorage.getItem("myList")) || [];
    }

    const exists = myList.some(item => item.id === movie.id);

    if (!exists) {

        myList.push({
            id: movie.id,
            title: movie.title,
            image: movie.image
        });

        alert(movie.title + " added to My List ❤️");

    } else {

        myList = myList.filter(item => item.id !== movie.id);
        alert(movie.title + " removed from My List");

    }

    if (typeof setMyList === "function") {
        setMyList(myList);
    } else {
        localStorage.setItem("myList", JSON.stringify(myList));
    }

    updateButton();

});


// ============================================
// RECOMMENDED MOVIES
// ============================================

const recommendedContainer = document.getElementById("recommendedMovies");

const recommendedMovies = movies.filter(
    item => item.category === movie.category && item.id !== movie.id
);

recommendedContainer.innerHTML = "";

if (recommendedMovies.length === 0) {

    recommendedContainer.innerHTML = `
        <p style="color:#aaa; padding:20px 0;">
            No recommendations available.
        </p>
    `;

} else {

    recommendedMovies.forEach(item => {

        recommendedContainer.innerHTML += `
            <div class="movie-card" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <p>${item.title}</p>
            </div>
        `;

    });

}


document.querySelectorAll(".movie-card").forEach(card => {

    card.addEventListener("click", () => {
        window.location.href = `movie.html?id=${card.dataset.id}`;
    });

});


// ============================================
// SCROLL TO TOP
// ============================================

window.scrollTo({ top: 0, behavior: "smooth" });


// ============================================
// IMAGE FALLBACK
// ============================================

const img = new Image();
img.src = movie.banner || movie.image;

img.onerror = function () {

    banner.style.background = `
        linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.85)),
        url("${movie.image}")
    `;
    banner.style.backgroundSize = "cover";

};


// ============================================
// PAGE FADE
// ============================================

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {
        document.body.style.transition = "opacity 0.4s";
        document.body.style.opacity = "1";
    }, 100);

});
