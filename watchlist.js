const content = document.getElementById("content")
const watchlistFromLocalStorage = JSON.parse(localStorage.getItem("myWatchlist"))
const section = document.getElementsByTagName("section")[1] //where to set new elements

const apiKey = "294adf6a"
const url = "https://www.omdbapi.com/"
let myWatch = []   //array to hold watchlist
let listDisplay    //the movie info section

//if something in local storage, display it, otherwise initial display
if(watchlistFromLocalStorage) {
    listDisplay = ''
    myWatch = watchlistFromLocalStorage
    getMovieInfo(myWatch)
}
else {
    setInitialDisplay()
}

//the add button will need to put that movie into local storage
section.addEventListener("click", (event) => {
    if(event.target.tagName === 'BUTTON') {
        let clickedId = event.target.id
        let lastChar = clickedId[clickedId.length - 1]
        myWatch.splice(Number(lastChar),1)
        localStorage.clear()
        localStorage.setItem("myWatchlist", JSON.stringify(myWatch))
        // alert("Movie removed from watchlist")
        if(myWatch.length !== 0) {   //if something left in the watchlist, get the movie info
            getMovieInfo(myWatch)
        }
        else {  //otherwise, set initial display
            setInitialDisplay() 
        }
    }
})

//initial display - nothing in watchlist
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
    listDisplay = ''
    myList.forEach((title, index) => {
        fetch(`${url}?apikey=${apiKey}&t=${title}`)
            .then(response => response.json())
            .then(data => {
                setHTML(data, index)
                content.innerHTML = listDisplay
            })
            .catch(error => console.log(error))
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
                    <button class="remove-btn" id="removeBtn${index}">
                        <i class="fa-solid fa-circle-minus"></i> 
                        Remove
                    </button>
                </div>
                <p class="plot">${data.Plot}</p>
            </div>
        </div>
    `
}