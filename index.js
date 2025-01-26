const watchlist = document.getElementById("watchlist")  //watchlist button
const enterFilm = document.getElementById("enter-film")
const searchBtn = document.getElementById("search-btn")
const content = document.getElementById("content")
const section = document.getElementsByTagName("section")[2] //where to set new elements
const movieAdded = document.getElementById("movie-added")

const apiKey = "294adf6a"
const url = "https://www.omdbapi.com/"
const watchlistFromLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))

let movieTitleArray = []  //the array of titles from first fetch
let movieDisplay    //the movie info section
let displayRendered = false //has a search been done yet?

searchBtn.addEventListener("click", () => {
    movieDisplay = ""
    movieTitleArray = []
    if(enterFilm.value !== "") {
        content.innerHTML = ``
        //This gets array with title, year, imdbID, type and poster (image)
        fetch(`${url}?apikey=${apiKey}&s=${enterFilm.value}`)
            .then(response => response.json())
            .then(data => {
                if(data.Search === undefined) {
                    setNoResultDisplay()
                }
                else {
                    displayRendered = true
                    setMovieTitleArray(data) //get an array of just the movie titles
                }
            })
            .catch(error => console.log(error))
    }
    else {
        console.log("Please enter a search string")
    }
})

//the add button will need to put that movie into local storage
section.addEventListener("click", (event) => {
    if(event.target.tagName === 'BUTTON') {
        let clickedId = event.target.id
        let lastChar = clickedId[clickedId.length - 1]
        let titleToSave = movieTitleArray[Number(lastChar)]
        watchlistFromLocalStorage.push(titleToSave)
        localStorage.setItem("myWatchlist", JSON.stringify(watchlistFromLocalStorage))
        // alert("Movie added to watchlist")
        if(movieTitleArray.includes(`${titleToSave}`)) {
            //call routine to briefly display success message
            movieAdded.style.display = "inline"
            setTimeout(function() {
                movieAdded.style.display = "none"
            },2000)
        }
    }
})

//initial display
function setInitialDisplay() {
    content.innerHTML = `
        <i class="fa-solid fa-film fa-5x"></i>
        <p class="explore">Start exploring</p>
    `
}

//get all the titles from the array, then fetch the info from API
function setMovieTitleArray(data) {
    const movieArray = data.Search
    movieArray.forEach((movie) => {
        movieTitleArray.push(movie.Title)
    })
   getMovieInfo(movieTitleArray)
}

//get the info for each movie in the array and set the content HTML
function getMovieInfo(movieTitleArray) {
    movieTitleArray.forEach((title, index) => {
        fetch(`${url}?apikey=${apiKey}&t=${title}`)
            .then(response => response.json())
            .then(data => {
                setHTML(data, index)
                content.innerHTML = movieDisplay
            })
            .catch(error => console.log(error))
    })
}

function setHTML(data, index) {
    movieDisplay += `
        <div id="movie-content" class="movie-content">
            <img src=${data.Poster} class="poster"/>
            <div class="info">
                <div class="titleAndRating">
                    <h3 class="title">${data.Title}</h3>
                    <p class="rating">⭐ ${data.imdbRating}</p>
                </div>
                <div class="timeGenreAdd">
                    <p class="runtime">${data.Runtime}</p> 
                    <p class="genre">${data.Genre}</p>
                    <button class="add-btn" id="addBtn${index}">
                        <i class="fa-solid fa-circle-plus"></i>  
                        Watchlist
                    </button>
                </div>
                <p class="plot">${data.Plot}</p>
            </div>
        </div>
    `
}

//empty result display
function setNoResultDisplay() {
    content.innerHTML = `
            <p class="empty-result">Unable to find what you are looking for.
                Please try another search. 
            </p>
        `
    }

setInitialDisplay()