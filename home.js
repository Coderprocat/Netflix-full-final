// ==========================================
// LOGIN CHECK
// ==========================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentSection = "home";
let currentCategoryMovies = [];

// Hover preview state
let hoverTimer = null;
let hideTimer = null;
let trailerTimer = null;
let activePreview = null;
let activeCard = null;

// ==========================================
// GET CURRENT SECTION
// ==========================================

function getCurrentSection() {
    const params = new URLSearchParams(window.location.search);
    return params.get("section") || "home";
}

// ==========================================
// OPEN MOVIE
// ==========================================

function openMovie(id) {
    if (id === undefined || id === null || id === "") return;
    hidePreview(true);
    window.location.href = "movie.html?id=" + encodeURIComponent(id);
}

// ==========================================
// CLICK DELEGATION
// ==========================================

document.addEventListener("click", function (e) {
    if (e.target.closest(".movie-preview")) return;

    const card = e.target.closest(".movie-card, .top10-card");
    if (!card) return;
    if (e.target.closest("button")) return;

    const id = card.dataset.id;
    if (id) {
        e.preventDefault();
        openMovie(id);
    }
});

// ==========================================
// YOUTUBE HELPERS
// ==========================================

function getYouTubeVideoId(url) {
    if (!url) return null;
    let videoId = null;
    try {
        if (url.includes("youtube.com/watch")) {
            videoId = new URL(url).searchParams.get("v");
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        } else if (url.includes("youtube.com/embed/")) {
            videoId = url.split("youtube.com/embed/")[1].split("?")[0];
        }
    } catch (e) {
        console.error("YouTube URL error", e);
    }
    return videoId;
}

// ==========================================
// HOVER PREVIEW (Netflix-style + 3s trailer)
// ==========================================

function getMovieById(id) {
    if (typeof movies === "undefined") return null;
    return movies.find(m => String(m.id) === String(id));
}

function isInMyList(id) {
    let list = [];
    if (typeof getMyList === "function") {
        list = getMyList();
    } else {
        try {
            list = JSON.parse(localStorage.getItem("myList")) || [];
        } catch (e) {
            list = [];
        }
    }
    return list.some(item => String(item.id) === String(id));
}

function toggleMyListFromPreview(movie, btn) {
    let list = [];
    if (typeof getMyList === "function") {
        list = getMyList();
    } else {
        try {
            list = JSON.parse(localStorage.getItem("myList")) || [];
        } catch (e) {
            list = [];
        }
    }

    const exists = list.some(item => String(item.id) === String(movie.id));

    if (exists) {
        list = list.filter(item => String(item.id) !== String(movie.id));
        btn.classList.remove("added");
        btn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    } else {
        list.push({ id: movie.id, title: movie.title, image: movie.image });
        btn.classList.add("added");
        btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
    }

    if (typeof setMyList === "function") {
        setMyList(list);
    } else {
        localStorage.setItem("myList", JSON.stringify(list));
    }

    if (typeof loadMyList === "function") loadMyList();
}

function buildPreviewHTML(movie) {
    const match = Math.round((Number(movie.rating) || 7) * 10);
    const inList = isInMyList(movie.id);
    const isSeries = movie.category === "Series";
    const genres = (movie.genre || "").split(",").map(g => g.trim()).filter(Boolean);

    return `
        <div class="preview-image">
            <img class="preview-poster" src="${movie.banner || movie.image}" alt="${movie.title}">
            <div class="preview-trailer" style="display:none;">
                <iframe
                    class="preview-iframe"
                    src=""
                    frameborder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
            <div class="preview-n-logo">N</div>
            <div class="preview-title-overlay">${movie.title}</div>
            <button type="button" class="preview-mute" title="Mute" style="display:none;">
                <i class="fa-solid fa-volume-xmark"></i>
            </button>
        </div>
        <div class="preview-content">
            <div class="preview-actions">
                <button type="button" class="preview-play" title="Play">
                    <i class="fa-solid fa-play"></i>
                </button>
                <button type="button" class="preview-add ${inList ? "added" : ""}" title="My List">
                    <i class="fa-solid fa-${inList ? "check" : "plus"}"></i>
                </button>
                <button type="button" class="preview-like" title="Like">
                    <i class="fa-solid fa-thumbs-up"></i>
                </button>
                <button type="button" class="preview-more" title="More Info">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
            </div>
            <div class="preview-details">
                <div class="preview-meta">
                    <span class="match">${match}% Match</span>
                    <span class="preview-maturity">${isSeries ? "A" : "U/A 16+"}</span>
                    <span>${isSeries ? "Limited Series" : (movie.duration || "")}</span>
                    <span class="preview-hd">HD</span>
                </div>
                <div class="preview-genres">
                    ${genres.map((g, i) =>
                        `<span>${g}</span>${i < genres.length - 1 ? '<span class="dot">•</span>' : ""}`
                    ).join("")}
                </div>
                ${match >= 80 ? `
                <div class="preview-badge">
                    <i class="fa-solid fa-thumbs-up"></i> Most Liked
                </div>` : ""}
            </div>
        </div>
    `;
}

function positionPreview(preview, card) {
    const rect = card.getBoundingClientRect();
    const previewWidth = Math.min(380, window.innerWidth - 24);
    const previewHeight = 460;

    let left = rect.left + rect.width / 2 - previewWidth / 2;
    let top = rect.top - 30;

    left = Math.max(12, Math.min(left, window.innerWidth - previewWidth - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - previewHeight - 12));

    preview.style.width = previewWidth + "px";
    preview.style.left = left + "px";
    preview.style.top = top + "px";
    preview.style.transform = "none";
}

function startPreviewTrailer(preview, movie) {
    if (!movie || !movie.trailer) return;

    const videoId = getYouTubeVideoId(movie.trailer);
    if (!videoId) return;

    const trailerBox = preview.querySelector(".preview-trailer");
    const iframe = preview.querySelector(".preview-iframe");
    const poster = preview.querySelector(".preview-poster");
    const muteBtn = preview.querySelector(".preview-mute");

    if (!trailerBox || !iframe) return;

    iframe.src =
        `https://www.youtube.com/embed/${videoId}` +
        `?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1` +
        `&loop=1&playlist=${videoId}&playsinline=1&enablejsapi=1`;

    trailerBox.style.display = "block";
    if (poster) poster.style.opacity = "0";
    if (muteBtn) muteBtn.style.display = "flex";
}

function stopPreviewTrailer(preview) {
    if (!preview) return;
    const iframe = preview.querySelector(".preview-iframe");
    if (iframe) iframe.src = "";
}

function showPreview(card) {
    const movie = getMovieById(card.dataset.id);
    if (!movie) return;

    hidePreview(true);

    const preview = document.createElement("div");
    preview.className = "movie-preview hover-floating";
    preview.dataset.id = String(movie.id);
    preview.innerHTML = buildPreviewHTML(movie);

    document.body.appendChild(preview);
    positionPreview(preview, card);

    // Force reflow then show
    requestAnimationFrame(() => {
        preview.style.opacity = "1";
        preview.style.visibility = "visible";
    });

    card.classList.add("preview-open");
    activePreview = preview;
    activeCard = card;

    // ---- After 3 seconds → start trailer ----
    clearTimeout(trailerTimer);
    trailerTimer = setTimeout(() => {
        if (activePreview === preview) {
            startPreviewTrailer(preview, movie);
        }
    }, 1000);

    // Button handlers
    const playBtn = preview.querySelector(".preview-play");
    const addBtn = preview.querySelector(".preview-add");
    const likeBtn = preview.querySelector(".preview-like");
    const moreBtn = preview.querySelector(".preview-more");

    if (playBtn) {
        playBtn.onclick = (e) => {
            e.stopPropagation();
            if (typeof getContinueWatching === "function" && typeof setContinueWatching === "function") {
                let list = getContinueWatching();
                list = list.filter(item => String(item.id) !== String(movie.id));
                list.unshift({ id: movie.id, title: movie.title, image: movie.image });
                if (list.length > 10) list.pop();
                setContinueWatching(list);
            }
            openMovie(movie.id);
        };
    }

    if (addBtn) {
        addBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMyListFromPreview(movie, addBtn);
        };
    }

    if (likeBtn) {
        likeBtn.onclick = (e) => {
            e.stopPropagation();
            likeBtn.classList.toggle("liked");
        };
    }

    if (moreBtn) {
        moreBtn.onclick = (e) => {
            e.stopPropagation();
            openMovie(movie.id);
        };
    }

    preview.addEventListener("mouseenter", () => {
        clearTimeout(hideTimer);
    });

    preview.addEventListener("mouseleave", () => {
        hideTimer = setTimeout(() => hidePreview(), 200);
    });
}

function hidePreview(immediate) {
    clearTimeout(hoverTimer);
    clearTimeout(hideTimer);
    clearTimeout(trailerTimer);

    if (activeCard) {
        activeCard.classList.remove("preview-open");
        activeCard = null;
    }

    if (activePreview) {
        const el = activePreview;
        stopPreviewTrailer(el);
        activePreview = null;

        if (immediate) {
            el.remove();
        } else {
            el.style.opacity = "0";
            el.style.transform = "scale(0.95)";
            setTimeout(() => el.remove(), 180);
        }
    }
}

function setupHoverPreview() {
    // Desktop only
    if (window.matchMedia("(hover: none)").matches) return;

    document.addEventListener("mouseover", function (e) {
        const card = e.target.closest(".movie-card");
        if (!card || card.classList.contains("top10-card")) return;

        if (activeCard === card && activePreview) {
            clearTimeout(hideTimer);
            return;
        }

        clearTimeout(hoverTimer);
        clearTimeout(hideTimer);

        // Show expanded card quickly (~0.5s), trailer after 3s more
        hoverTimer = setTimeout(() => {
            showPreview(card);
        }, 500);
    });

    document.addEventListener("mouseout", function (e) {
        const card = e.target.closest(".movie-card");
        if (!card) return;

        const related = e.relatedTarget;
        if (related && (related.closest(".movie-preview") || related.closest(".movie-card") === card)) {
            return;
        }

        clearTimeout(hoverTimer);
        hideTimer = setTimeout(() => hidePreview(), 250);
    });

    window.addEventListener("scroll", () => {
        if (activePreview && activeCard) {
            positionPreview(activePreview, activeCard);
        }
    }, true);

    window.addEventListener("resize", () => hidePreview(true));
}

// ==========================================
// HERO TRAILER
// ==========================================

let heroHoverTimer = null;

function stopHeroTrailer() {
    clearTimeout(heroHoverTimer);
    const trailer = document.getElementById("heroTrailer");
    const iframe = document.getElementById("trailerIframe");
    const background = document.querySelector(".hero-bg");
    if (trailer) trailer.classList.remove("active");
    if (iframe) iframe.src = "";
    if (background) background.style.opacity = "1";
}

function startHeroTrailer(movie) {
    if (!movie || !movie.trailer) return;
    const videoId = getYouTubeVideoId(movie.trailer);
    if (!videoId) return;
    const trailer = document.getElementById("heroTrailer");
    const iframe = document.getElementById("trailerIframe");
    const background = document.querySelector(".hero-bg");
    if (!trailer || !iframe) return;
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${videoId}&playsinline=1`;
    trailer.classList.add("active");
    if (background) background.style.opacity = "0";
}

function setHeroMovie(movie, isTV = false) {
    if (!movie) return;

    const hero = document.querySelector(".hero");
    const background = document.querySelector(".hero-bg");
    const label = document.querySelector(".netflix-series");
    const title = document.querySelector(".banner-content h1");
    const details = document.querySelector(".hero-details");
    const description = document.querySelector(".banner-content p");
    const playButton = document.querySelector(".banner-content .play");
    const infoButton = document.getElementById("moreInfoBtn");

    if (!hero || !background || !title || !details || !description) return;

    stopHeroTrailer();

    const heroImage = movie.banner || movie.image;
    background.style.backgroundImage = `url("${encodeURI(heroImage)}")`;
    background.style.backgroundSize = "cover";
    background.style.backgroundPosition = "center top";

    if (label) {
        label.innerHTML = isTV ? `<span>N</span> SERIES` : `<span>N</span> FILM`;
    }

    title.textContent = movie.title;

    const match = Math.round((Number(movie.rating) || 7) * 10);
    details.innerHTML = `
        <span class="match">${match}% Match</span>
        <span>${movie.year || ""}</span>
        <span>${movie.duration || ""}</span>
        <span class="hd">HD</span>
    `;

    description.textContent = movie.description || "";

    if (playButton) {
        playButton.onclick = function (e) {
            e.stopPropagation();
            openMovie(movie.id);
        };
    }
    if (infoButton) {
        infoButton.onclick = function (e) {
            e.stopPropagation();
            openMovie(movie.id);
        };
    }

    hero.onmouseenter = () => {
        clearTimeout(heroHoverTimer);
        heroHoverTimer = setTimeout(() => startHeroTrailer(movie), 3000);
    };
    hero.onmouseleave = () => stopHeroTrailer();
}

// ==========================================
// CATEGORY / NEW & POPULAR
// ==========================================

function loadCategoryPage() {
    const section = getCurrentSection();
    currentSection = section;

    const homePageContent = document.getElementById("homePageContent");
    const categoryPage = document.getElementById("categoryPage");
    const categoryTitle = document.getElementById("categoryPageTitle");
    const categorySections = document.getElementById("categorySections");
    const hero = document.querySelector(".hero");

    if (!homePageContent || !categoryPage || !categoryTitle || !categorySections) return;

    if (section !== "movies" && section !== "tv" && section !== "new") {
        document.body.classList.remove("category-mode");
        homePageContent.style.display = "block";
        categoryPage.style.display = "none";
        if (hero) hero.style.display = "flex";
        return;
    }

    document.body.classList.add("category-mode");
    homePageContent.style.display = "none";
    categoryPage.style.display = "block";
    if (hero) hero.style.display = "flex";

    let filteredMovies;

    if (section === "movies") {
        categoryTitle.textContent = "Movies";
        filteredMovies = movies.filter(m => m.category !== "Series");
    } else if (section === "tv") {
        categoryTitle.textContent = "TV Shows";
        filteredMovies = movies.filter(m => m.category === "Series");
    } else {
        categoryTitle.textContent = "New & Popular";
        filteredMovies = [...movies].sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    currentCategoryMovies = filteredMovies;

    const featured = filteredMovies[0];
    if (featured) setHeroMovie(featured, section === "tv");

    setupGenreMenu(filteredMovies, section);
    renderCategorySections(filteredMovies, section);
}

function setupGenreMenu(filteredMovies, section) {
    const genreMenu = document.getElementById("genreMenu");
    const genreButton = document.getElementById("genreButton");
    if (!genreMenu || !genreButton) return;

    genreMenu.innerHTML = "";

    const genres = new Set();
    filteredMovies.forEach(movie => {
        if (!movie.genre) return;
        movie.genre.split(",").forEach(g => {
            const clean = g.trim();
            if (clean) genres.add(clean);
        });
    });

    const allBtn = document.createElement("button");
    allBtn.textContent = "All Genres";
    allBtn.onclick = () => {
        renderCategorySections(filteredMovies, section);
        genreMenu.classList.remove("open");
    };
    genreMenu.appendChild(allBtn);

    [...genres].sort().forEach(genre => {
        const btn = document.createElement("button");
        btn.textContent = genre;
        btn.onclick = () => {
            const list = filteredMovies.filter(m =>
                m.genre && m.genre.toLowerCase().includes(genre.toLowerCase())
            );
            document.getElementById("categorySections").innerHTML = "";
            createCategorySection(genre, list);
            genreMenu.classList.remove("open");
        };
        genreMenu.appendChild(btn);
    });

    genreButton.onclick = (e) => {
        e.stopPropagation();
        genreMenu.classList.toggle("open");
    };

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".genre-dropdown")) {
            genreMenu.classList.remove("open");
        }
    });
}

function renderCategorySections(filteredMovies, section) {
    const container = document.getElementById("categorySections");
    if (!container) return;
    container.innerHTML = "";

    if (filteredMovies.length === 0) {
        container.innerHTML = `<p class="category-empty">No titles found.</p>`;
        return;
    }

    const mainTitle =
        section === "new" ? "New & Popular" :
        section === "movies" ? "Popular Movies" : "Popular Series";

    createCategorySection(mainTitle, filteredMovies, container);

    const genres = new Set();
    filteredMovies.forEach(movie => {
        if (!movie.genre) return;
        movie.genre.split(",").forEach(g => {
            const clean = g.trim();
            if (clean) genres.add(clean);
        });
    });

    [...genres].sort().forEach(genre => {
        const list = filteredMovies.filter(m =>
            m.genre && m.genre.toLowerCase().includes(genre.toLowerCase())
        );
        if (list.length > 0) createCategorySection(genre, list, container);
    });
}

function createCategorySection(title, movieList, parentContainer) {
    if (!parentContainer) parentContainer = document.getElementById("categorySections");
    if (!parentContainer || !movieList || movieList.length === 0) return;

    const section = document.createElement("section");
    section.className = "category-movie-section";

    const heading = document.createElement("div");
    heading.className = "category-section-heading";
    const h2 = document.createElement("h2");
    h2.textContent = title;
    heading.appendChild(h2);
    section.appendChild(heading);

    const row = document.createElement("div");
    row.className = "category-movie-row";

    movieList.forEach(movie => {
        const card = createMovieCard(movie);
        if (card) row.appendChild(card);
    });

    section.appendChild(row);

    if (movieList.length > 4) {
        const arrow = document.createElement("button");
        arrow.className = "category-arrow";
        arrow.type = "button";
        arrow.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
        arrow.onclick = (e) => {
            e.stopPropagation();
            row.scrollBy({ left: 900, behavior: "smooth" });
        };
        section.appendChild(arrow);
    }

    parentContainer.appendChild(section);
}

function createMovieCard(movie) {
    if (!movie || movie.id === undefined) return null;

    const card = document.createElement("div");
    card.className = "movie-card";
    card.dataset.id = String(movie.id);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.style.cursor = "pointer";
    card.style.pointerEvents = "auto";

    const poster = document.createElement("img");
    poster.className = "movie-poster";
    poster.src = movie.image;
    poster.alt = movie.title || "Movie";
    poster.loading = "lazy";
    poster.draggable = false;
    poster.style.pointerEvents = "none";

    card.appendChild(poster);

    card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMovie(movie.id);
        }
    });

    return card;
}

// ==========================================
// HOME PAGE
// ==========================================

function setupHomeHero() {
    const homeMovie = movies.find(m => m.title === "Gran Turismo") || movies[0];
    if (homeMovie) setHeroMovie(homeMovie, false);
}

function loadHomePage() {
    const section = getCurrentSection();
    if (section === "movies" || section === "tv" || section === "new") return;

    document.body.classList.remove("category-mode");
    const homePageContent = document.getElementById("homePageContent");
    const categoryPage = document.getElementById("categoryPage");
    if (homePageContent) homePageContent.style.display = "block";
    if (categoryPage) categoryPage.style.display = "none";

    const hero = document.querySelector(".hero");
    if (hero) hero.style.display = "flex";

    setupHomeHero();
}

function loadTop10Movies() {
    const top10Container = document.getElementById("top10Movies");
    if (!top10Container) return;
    top10Container.innerHTML = "";

    if (typeof movies === "undefined" || !movies.length) {
        console.error("movies array is missing");
        return;
    }

    const top10 = movies.slice(0, 10);

    top10.forEach((movie, index) => {
        const card = document.createElement("div");
        card.className = "top10-card";
        card.dataset.id = String(movie.id);
        card.style.cursor = "pointer";
        card.style.pointerEvents = "auto";

        card.innerHTML = `
            <div class="top10-number">${index + 1}</div>
            <div class="top10-poster-wrapper">
                <img class="top10-poster" src="${movie.image}" alt="${movie.title}" loading="lazy" draggable="false" style="pointer-events:none">
            </div>
            <div class="top10-title">${movie.title}</div>
        `;

        top10Container.appendChild(card);
    });
}

function loadUserRow(containerId, sectionId, getListFn, globalKey) {
    const container = document.getElementById(containerId);
    const section = document.getElementById(sectionId);
    if (!container) return;

    container.innerHTML = "";

    let list = [];
    if (typeof getListFn === "function") {
        list = getListFn();
    } else {
        try {
            list = JSON.parse(localStorage.getItem(globalKey)) || [];
        } catch (e) {
            list = [];
        }
    }

    if (section) {
        section.style.display = list.length === 0 ? "none" : "block";
    }

    list.forEach(item => {
        const found = movies.find(m => m.id === item.id || m.id === Number(item.id));
        if (!found) return;
        const card = createMovieCard(found);
        if (card) container.appendChild(card);
    });
}

function loadContinueWatching() {
    loadUserRow(
        "continueWatching",
        "continueSection",
        typeof getContinueWatching === "function" ? getContinueWatching : null,
        "continueWatching"
    );
}

function loadMyList() {
    loadUserRow(
        "myListMovies",
        "myListSection",
        typeof getMyList === "function" ? getMyList : null,
        "myList"
    );
}

function loadRecentlyViewed() {
    loadUserRow(
        "recentMovies",
        "recentSection",
        typeof getRecentlyViewed === "function" ? getRecentlyViewed : null,
        "recentMovies"
    );
}

function loadGenreRows() {
    const container = document.getElementById("genreRows");
    if (!container) return;
    container.innerHTML = "";

    if (typeof movies === "undefined") return;

    const genresToShow = ["Action", "Horror", "Sci-Fi", "Comedy", "Series"];

    genresToShow.forEach(genre => {
        let list;
        if (genre === "Series") {
            list = movies.filter(m => m.category === "Series");
        } else {
            list = movies.filter(m =>
                m.genre && m.genre.toLowerCase().includes(genre.toLowerCase())
            );
        }

        if (list.length === 0) return;

        const section = document.createElement("section");
        section.className = "movie-section";

        const heading = document.createElement("div");
        heading.className = "section-heading";
        heading.innerHTML = `
            <h2>${genre === "Series" ? "TV Shows" : genre}</h2>
            <button type="button" class="arrow-btn"><i class="fa-solid fa-chevron-right"></i></button>
        `;
        section.appendChild(heading);

        const row = document.createElement("div");
        row.className = "movie-row";

        list.forEach(movie => {
            const card = createMovieCard(movie);
            if (card) row.appendChild(card);
        });

        section.appendChild(row);

        const arrow = heading.querySelector(".arrow-btn");
        if (arrow) {
            arrow.onclick = (e) => {
                e.stopPropagation();
                row.scrollBy({ left: 900, behavior: "smooth" });
            };
        }

        container.appendChild(section);
    });
}

function setupRowArrows() {
    document.querySelectorAll(".movie-section").forEach(section => {
        const row = section.querySelector(".movie-row");
        const button = section.querySelector(".arrow-btn");
        if (!row || !button) return;
        button.onclick = (e) => {
            e.stopPropagation();
            row.scrollBy({ left: 900, behavior: "smooth" });
        };
    });

    const top10Row = document.getElementById("top10Movies");
    const top10Arrow = document.querySelector(".top10-arrow");
    if (top10Row && top10Arrow) {
        top10Arrow.onclick = (e) => {
            e.stopPropagation();
            top10Row.scrollBy({ left: 900, behavior: "smooth" });
        };
    }
}

function updateNavigation() {
    const section = getCurrentSection();
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.dataset.section === section) link.classList.add("active");
    });
}

function pageFade() {
    window.addEventListener("load", () => {
        document.body.style.opacity = "0";
        setTimeout(() => {
            document.body.style.transition = "opacity 0.4s";
            document.body.style.opacity = "1";
        }, 100);
    });
}

// ==========================================
// INIT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    if (typeof movies === "undefined") {
        console.error("movies.js did not load. Movie cards will not work.");
        return;
    }

    if (typeof displayUserName === "function") {
        displayUserName();
    }

    const profileName = localStorage.getItem("activeProfileName");
    if (profileName) {
        const el = document.querySelector(".children-text");
        if (el) el.textContent = profileName;
    }

    updateNavigation();
    loadCategoryPage();
    loadHomePage();
    loadTop10Movies();
    loadContinueWatching();
    loadMyList();
    loadRecentlyViewed();
    loadGenreRows();
    setupRowArrows();
    setupHoverPreview();
    pageFade();
});
