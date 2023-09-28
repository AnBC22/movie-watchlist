const searchForm = document.getElementById('search-form')
const searchEl = document.getElementById('search')
const movieContainer = document.getElementById('movie-container')
const moviesFromLocalStorage = JSON.parse(localStorage.getItem('myWatchlist'))
export let arrayOfMovieSearchResults = ''
export let watchlistArray = []

if(moviesFromLocalStorage) {
    watchlistArray = moviesFromLocalStorage
}

searchForm.addEventListener('submit', function(e) {
    e.preventDefault()
    fetch(`https://www.omdbapi.com/?s=${searchEl.value}&apikey=d57d15bb`)
        .then(res => res.json())
        .then(moviesObjResult => {
            if(moviesObjResult.Error) {
                movieContainer.innerHTML = `<p class="empty">Unable to find what you're looking for. Please try another search.</p>`
            } else {
                //moviesObjResult.Search is the array of movies the response returns.
                //As it returns an array of movies with limited data, I need to send another
                //request to get an array of complete data for each movie:
                getCompleteDataOfEachMovie(moviesObjResult.Search).then(moviesArrComplete => 
                //Now that I have an array with complete data, I can create the Html structure I need for each movie:
                getMovieHtml(moviesArrComplete))
            }
        })
    })

function getCompleteDataOfEachMovie(moviesArray) {
    const moreData = moviesArray.map((movie) => {
        return fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=d57d15bb`)
            .then(res => res.json()) 
            //For each movie I get an object with complete data about it
            .then(movieObj => movieObj) 
    })
    //Promise.all waits for all promises to complete before returning the array. 
    return Promise.all(moreData)
}

export function getMovieHtml(moviesArr) {
    let movieHtml = ''
  
    arrayOfMovieSearchResults = moviesArr
    
    if(moviesArr) {
         moviesArr.forEach((movie) => {
            movie.Poster === "N/A" ? movie.Poster = "img/img-not-found.png" : movie.Poster

            //Check if a movie from watchlistArray is in the search results. If it is, then show that is was already added
            let notAdded = ''
            let added = 'hidden'
            if(isResultInWatchlistArray(movie.imdbID)) {
                notAdded = 'hidden'
                added = ''
            }
            //Create the html for each movie in the search results
            movieHtml += `
                <div class="movie-option white-text">
                    <img class="small-img" src="${movie.Poster}">

                    <div>

                        <div class="movie-top">
                            <h3 class="movie-title">${movie.Title}</h3>
                            <p class="small-text">⭐ ${movie.imdbRating}</p>
                        </div>

                        <div class="row">
                            <p class="small-text">${movie.Runtime}</p>
                            <p class="small-text">${movie.Genre}</p>
        
                            <div class="watchlist ${notAdded}" id="watchlist-${movie.imdbID}">
                                <i data-add-movie="${movie.imdbID}" class="fa-solid fa-circle-plus small-text"></i>
                                <p class="small-text">Watchlist</p>
                            </div>

                            <div class="watchlist ${added}">
                                <p>✔️ Added to watchlist</p>
                            </div>

                            <div class="remove-movie hidden">
                                <i data-remove-movie="${movie.imdbID}" class="fa-solid fa-circle-minus small-text"></i>
                                <p class="small-text">Remove</p>
                            </div>
                        </div>
                        <p class="dimmed-text movie-plot">${movie.Plot}</p>

                    </div>
                </div>
            `
        })
        render(movieHtml)
    } 
}

function isResultInWatchlistArray(id) {
    let result = ''

    watchlistArray.forEach((watchlistMovie) => {
        if(watchlistMovie.imdbID === id) {
            result = true
        }
    })
    return result
}

export function render(htmlData) {
    movieContainer.innerHTML = htmlData
}

//Saving the movies to local storage
document.addEventListener('click', saveMovietoWatchlistArray)

function saveMovietoWatchlistArray(e) {
    const movieID = e.target.dataset.addMovie

    if(movieID) {
        for(let movie of arrayOfMovieSearchResults) {
            if(movie.imdbID === movieID) {
                watchlistArray.push(movie)

                document.getElementById(`watchlist-${movieID}`).innerHTML = `<p>✔️ Added to watchlist</p>`
            }
        }
    saveMoviesToLocalStorage("myWatchlist")
    }
}

export function saveMoviesToLocalStorage(key) {
    localStorage.setItem(key, JSON.stringify(watchlistArray))
}
