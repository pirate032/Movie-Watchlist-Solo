const content = document.getElementById("content")
let myList = []    //array to hold watchlist
const watchlistFromLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))

let listDisplay    //the movie info section

if(watchlistFromLocalStorage) {
    myList = [...watchlistFromLocalStorage]
    console.log(myList)
}
else {
    setInitialDisplay()
}

//initial display
function setInitialDisplay() {
    content.innerHTML = `
        <p class="explore">Your watchlist is looking a little empty...</p>
        <a href="/index.html" class="add">
            <i class="fa-solid fa-circle-plus"></i>  
            Let's add some movies!
        </a>
    `
}

//get the info for each movie in the array and set the content HTML
function getMovieInfo(myList) {
    myList.forEach((title, index) => {
        fetch(`${url}?apikey=${apiKey}&t=${title}`)
            .then(response => response.json())
            .then(data => {
                setHTML(data, index)
                content.innerHTML = movieDisplay
            })
    })
}

function setHTML(data, index) {
    listDisplay += `
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