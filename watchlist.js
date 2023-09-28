import { 
    getMovieHtml, 
    watchlistArray,
    saveMoviesToLocalStorage,
} from '/index.js'

const movieContainerEl = document.getElementById('movie-container')

function getMoviesFromLocalStorage() {
    const moviesInLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))
    
    if(moviesInLocalStorage) {
        return moviesInLocalStorage
    } else {
        movieContainerEl.innerHTML = `
        <p class="empty">Your watchlist is looking a little empty...</p>
        <a href="/index.html" class="add-movies">
            <i class="fa-solid fa-circle-plus"></i>
            <p>Let's add some movies!</p>
        </a>
        `
    }
}

getMovieHtml(getMoviesFromLocalStorage())

document.addEventListener('click', removeMovieFromWatchlistArray)

function removeMovieFromWatchlistArray(e) {
    const movieID = e.target.dataset.removeMovie

    if(movieID) {
        getMoviesFromLocalStorage().forEach((movie, index) => {
            if(movie.imdbID === movieID) {
                 watchlistArray.splice(index, 1)
             }
        })
        saveMoviesToLocalStorage("myWatchlist")

        if(watchlistArray.length === 0) {
            localStorage.clear()
        }
    }
    getMovieHtml(getMoviesFromLocalStorage()) 
    showRemoveIcon()
}

function showRemoveIcon() {
    const watchlistIcons = document.getElementsByClassName('watchlist')
    const removeIcons = document.getElementsByClassName('remove-movie')
    
    for(let watchlistIcon of watchlistIcons) {
        watchlistIcon.classList.add('hidden')
    }
    for(let removeIcon of removeIcons) {
        removeIcon.classList.remove('hidden')
    } 
}

showRemoveIcon()
