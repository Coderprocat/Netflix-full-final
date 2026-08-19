// ============================================
// MOVIES DATA
// ============================================

const movies = [

    {
        id: 1,
        title: "Stranger Things",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        genre: "Sci-Fi, Horror, Drama",
        year: 2016,
        duration: "4 Seasons",
        rating: "8.7",
        imdb: "8.7",
        category: "Series",
        image: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
        banner: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
        trailer: "https://youtu.be/b9EkMc79ZSU?si=qYta2y4t76TAdjlv",
        cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"]
    },

    {
        id: 2,
        title: "The Witcher",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        genre: "Fantasy, Action, Drama",
        year: 2019,
        duration: "3 Seasons",
        rating: "8.2",
        imdb: "8.2",
        category: "Series",
        image: "the-witcher.jpg",
        banner: "the-witcher.jpg",
        trailer: "https://youtu.be/ndl1W4ltcmg?si=a_JAjyW20fEm5dUG",
        cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan", "Joey Batey"]
    },

    {
        id: 3,
        title: "Money Heist",
        description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
        genre: "Crime, Thriller, Drama",
        year: 2017,
        duration: "5 Seasons",
        rating: "8.3",
        imdb: "8.3",
        category: "Series",
        image: "money-hiest.jpg",
        banner: "money.jpg",
        trailer: "https://youtu.be/_InqQJRqGW4?si=Z5m_qPljmuHizzWe",
        cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño", "Pedro Alonso"]
    },

    {
        id: 4,
        title: "Extraction",
        description: "A black-market mercenary who has nothing to lose is hired to rescue the kidnapped son of an imprisoned international crime lord.",
        genre: "Action, Thriller",
        year: 2020,
        duration: "1h 56m",
        rating: "6.7",
        imdb: "6.7",
        category: "Action",
        image: "extracrion.jpg",
        banner: "extracrion.jpg",
        trailer: "https://www.youtube.com/embed/L6P3nI6VnlY",
        cast: ["Chris Hemsworth", "Rudhraksh Jaiswal", "Randeep Hooda", "Golshifteh Farahani"]
    },

    {
        id: 5,
        title: "The Gray Man",
        description: "When a shadowy CIA agent uncovers damning agency secrets, he's hunted across the globe by a psychopathic rogue operative.",
        genre: "Action, Thriller",
        year: 2022,
        duration: "2h 9m",
        rating: "6.5",
        imdb: "6.5",
        category: "Action",
        image: "theGrayMan.jpg",
        banner: "The-Gray-Man-_-Movie-Poster.jpg",
        trailer: "https://www.youtube.com/embed/Pj0wz7uj8CQ",
        cast: ["Ryan Gosling", "Chris Evans", "Ana de Armas", "Billy Bob Thornton"]
    },

    {
        id: 7,
        title: "Don't Look Up",
        description: "Two low-level astronomers must go on a media tour to warn mankind of an approaching comet that will destroy planet Earth.",
        genre: "Comedy, Drama, Sci-Fi",
        year: 2021,
        duration: "2h 18m",
        rating: "7.2",
        imdb: "7.2",
        category: "Comedy",
        image: "dont.webp",
        banner: "don'tLook.webp",
        trailer: "https://www.youtube.com/embed/RbIxom0gTEg",
        cast: ["Leonardo DiCaprio", "Jennifer Lawrence", "Meryl Streep", "Jonah Hill"]
    },

    {
        id: 8,
        title: "The Adam Project",
        description: "A time-traveling pilot teams up with his younger self and his late father to come to terms with his past while saving the future.",
        genre: "Sci-Fi, Action, Adventure",
        year: 2022,
        duration: "1h 46m",
        rating: "6.7",
        imdb: "6.7",
        category: "Sci-Fi",
        image: "mask.jpg",
        banner: "mask.jpg",
        trailer: "https://www.youtube.com/embed/IE8HIsIrq4o",
        cast: ["Ryan Reynolds", "Walker Scobell", "Mark Ruffalo", "Jennifer Garner"]
    },

    {
        id: 9,
        title: "Venom",
        description: "A journalist becomes the host of an alien symbiote that grants him superpowers while bonding with him in unexpected ways.",
        genre: "Action, Sci-Fi, Thriller",
        year: 2018,
        duration: "1h 52m",
        rating: "6.6",
        imdb: "6.6",
        category: "Action",
        image: "venom.jpeg",
        banner: "venom.jpeg",
        trailer: "https://www.youtube.com/embed/u9Mv98Gr5pY",
        cast: ["Tom Hardy", "Michelle Williams", "Riz Ahmed", "Jenny Slate"]
    },

    {
        id: 10,
        title: "My Fault London",
        description: "A romantic drama about unexpected love, family secrets, and the choices that change everything.",
        genre: "Romance, Drama",
        year: 2025,
        duration: "1h 50m",
        rating: "7.5",
        imdb: "7.5",
        category: "Romance",
        image: "my-fault-london-poster.avif",
        banner: "my-fault-london-poster.avif",
        trailer: "https://youtu.be/4WwtfTaW_bM?si=RFjwrKGTIZXtBhyN",
        cast: ["Cast TBA"]
    },

    {
        id: 11,
        title: "The Nun",
        description: "A priest with a haunted past and a novice on the threshold of her final vows uncover an unspeakable evil.",
        genre: "Horror, Mystery, Thriller",
        year: 2018,
        duration: "1h 36m",
        rating: "5.3",
        imdb: "5.3",
        category: "Horror",
        image: "nun.jpg",
        banner: "nun.jpg",
        trailer: "https://youtu.be/pzD9zGcUNrw?si=YsVdIwss4fg_E9xX",
        cast: ["Taissa Farmiga", "Demián Bichir", "Jonas Bloquet", "Bonnie Aarons"]
    },

    {
        id: 12,
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: "Sci-Fi, Drama, Adventure",
        year: 2014,
        duration: "2h 49m",
        rating: "8.7",
        imdb: "8.7",
        category: "Sci-Fi",
        image: "interstellar.jpg",
        banner: "interstellar.jpg",
        trailer: "https://youtu.be/zSWdZVtXT7E?si=oiYbYxi0PR4_vamE",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
    },

    {
        id: 13,
        title: "John Wick",
        description: "An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.",
        genre: "Action, Thriller, Crime",
        year: 2014,
        duration: "1h 41m",
        rating: "7.4",
        imdb: "7.4",
        category: "Action",
        image: "john wick.jpg",
        banner: "john wick.jpg",
        trailer: "https://youtu.be/C0BMx-qxsP4?si=8clHrd6Euh9YXML5",
        cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen", "Willem Dafoe"]
    },

    {
        id: 14,
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: "Sci-Fi, Action, Thriller",
        year: 2010,
        duration: "2h 28m",
        rating: "8.8",
        imdb: "8.8",
        category: "Sci-Fi",
        image: "inception.jpeg",
        banner: "inception.jpeg",
        trailer: "https://youtu.be/YoHD9XEInc0?si=59smmFHwzThv_LkO",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"]
    },

    {
        id: 15,
        title: "Gran Turismo",
        description: "Based on the incredible true story of a young gamer whose racing skills earned him the chance to become a professional race car driver.",
        genre: "Action, Drama, Sport",
        year: 2023,
        duration: "2h 15m",
        rating: "7.1",
        imdb: "7.1",
        category: "Action",
        image: "turismo.jpg",
        banner: "turismo.jpg",
        trailer: "https://youtu.be/GVPzGBvPrzw?si=ptSuX29wk_HikaRK",
        cast: ["Archie Madekwe", "David Harbour", "Orlando Bloom", "Darren Barnet"]
    },

    {
        id: 16,
        title: "Sinister",
        description: "A true-crime writer finds a box of home videos that uncover a family's horrific secret, and must protect his own family from a supernatural threat.",
        genre: "Horror, Mystery, Thriller",
        year: 2012,
        duration: "1h 50m",
        rating: "6.8",
        imdb: "6.8",
        category: "Horror",
        image: "sinister.jpg",
        banner: "sinister.jpg",
        trailer: "https://youtu.be/fChx_YZUAR0?si=kH651fTFTwcQKJcK",
        cast: ["Ethan Hawke", "Juliet Rylance", "James Ransone", "Fred Dalton Thompson"]
    }

];
