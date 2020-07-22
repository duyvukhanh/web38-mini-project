window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pageIndex = Number(urlParams.get('pageIndex')) || 1
    moveScreen()
    let url = `http://localhost:9000/api/music?pageIndex=${pageIndex}`
    fetchMusicList(url)
    assignFirstTime()
    onTimeUpdateAudio()
    addEventToPlayBtn()
    addDurationOfCurrentTrack()
}

function assignFirstTime() {
    let status = JSON.parse(localStorage.getItem('status'))
    if (status) {
        let API = genGetOneTrackAPI(status.currentTrack._id)
        getData(API)
            .then((data) => {
                document.querySelector('#trackImageToPlay').innerHTML = `
                <div class="track-image-block" id="${data._id}">
                    <img id="trackImg" class="" src="../image/${data.image}.jpg" alt="">
                </div>
                `
                document.querySelector('#trackTitleToPlay').innerHTML = `${data.title}`
                document.querySelector('#trackArtistToPlay').innerHTML = `${data.artist}`
                document.querySelector('#audio').src = `../music/${data.url}.mp3`
                let status = JSON.parse(localStorage.getItem('status'))
                if (!status) {
                    status = {}
                    localStorage.setItem('status', JSON.stringify(status))
                }
                if (status) {
                    status.lastTrack = status.currentTrack
                    status.currentTrack = data
                    status.nextTrack = data.nextTrack[0]
                    localStorage.setItem('status', JSON.stringify(status))
                }

                let content = ``
                for (let track of data.nextTrack) {
                    content += `
                    <div class="col">
                        <div class="track-block" id="${track._id}">
                            <div class="track-image" onclick="assignTrack('${track._id}')">
                                <img src="../image/${track.image}.jpg" alt="${track.title}">
                                <div class="play-btn-on-thumb">
                                    <i class="far fa-play-circle"></i>     
                                </div>
                            </div>
                            <div class="track-title" onclick="assignTrack('${track._id}')">${track.title}</div>
                            <div class="track-artist">${track.artist}</div>
                        </div>
                    </div>
                    `
                }
                document.querySelector('#relative-row').innerHTML = content

                audio.addEventListener("ended", function () {
                    nextTrack(result[0]._id)
                });
                showPlayBtnOnThumb()
            })
    }
}

function fetchMusicList(url) {
    getData(url)
        .then((data) => {
            handleResult(data)
        })
}

async function getData(url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

function handleResult(result) {
    renderMusicList(result)
    renderPagination(result)
}

function moveScreen() {
    let menuScreen = document.getElementById("screen1")
    let musicPlayerScreen = document.getElementById("screen2")
    let buttonToMusicPlayer = document.getElementById("buttonToMusicPlayer")
    let buttonToMenu = document.getElementById("buttonToMenu")

    buttonToMusicPlayer.addEventListener("click", (e) => {
        menuScreen.style.marginLeft = "-950px"
        musicPlayerScreen.style.marginLeft = "-400px"
    })
    buttonToMenu.addEventListener("click", (e) => {
        menuScreen.style.marginLeft = "-400px"
        musicPlayerScreen.style.marginLeft = "400px"
    })
}

function toScreen1() {
    let menuScreen = document.getElementById("screen1")
    let musicPlayerScreen = document.getElementById("screen2")
    menuScreen.style.marginLeft = "-400px"
    musicPlayerScreen.style.marginLeft = "400px"
}

function toScreen2() {
    let menuScreen = document.getElementById("screen1")
    let musicPlayerScreen = document.getElementById("screen2")
    menuScreen.style.marginLeft = "-950px"
    musicPlayerScreen.style.marginLeft = "-400px"
}


function renderMusicList(data) {
    let pageSize = 8
    let content1 = ``
    let content2 = ``

    for (let i = 0; i < pageSize; i++) {
        if (i < 4) {
            if (!data[i]) {
                let html = `
                <div class="col"></div>`
                content1 += html
            } else {
                let html = `
                <div class="col">
                    <div class="track-block" id="${data[i]._id}">
                        <div class="track-image" onclick="assignTrack('${data[i]._id}')">
                            <img src="../image/${data[i].image}.jpg" alt="${data[i].title}">
                            <div class="play-btn-on-thumb">
                                <i class="far fa-play-circle"></i>     
                            </div>
                            
                        </div>
                        <div class="track-title" onclick="assignTrack('${data[i]._id}')">${data[i].title}</div>
                        <div class="track-artist">${data[i].artist}</div>
                    </div>
                </div>`
                content1 += html
            }
        } else {
            if (!data[i]) {
                let html = `
                <div class="col"></div>`
                content2 += html
            } else {
                let html = `
                <div class="col">
                    <div class="track-block" id="${data[i]._id}">
                        <div class="track-image" onclick="assignTrack('${data[i]._id}')">
                            <img src="../image/${data[i].image}.jpg" alt="${data[i].title}">
                            <div class="play-btn-on-thumb">
                                <i class="far fa-play-circle"></i>     
                            </div>

                        </div>
                        <div class="track-title" onclick="assignTrack('${data[i]._id}')">${data[i].title}</div>
                        <div class="track-artist">${data[i].artist}</div>
                    </div>
                </div>`
                content2 += html
            }
        }

    }
    let finalHtml = `
        <div class="row music-row">
            ${content1}
        </div>
        <div class="row music-row">
            ${content2}
        </div>
        `

    document.getElementById("musicList").innerHTML = finalHtml
    showPlayBtnOnThumb()

}

function renderPagination(data) {
    const urlParams = new URLSearchParams(window.location.search);
    const pageIndex = Number(urlParams.get('pageIndex')) || 1
    const sortBy = urlParams.get('sortBy')
    const sort = urlParams.get('sort')
    const search = urlParams.get('search')

    let lastPage = pageIndex - 1
    let nextPage = pageIndex + 1

    let lastPageAPI = genAPI(lastPage, sortBy, sort, search)
    let nextPageAPI = genAPI(nextPage, sortBy, sort, search)

    let pageNumberHTML = `
        ${pageIndex == 1 ? '' : `<li class="page-item"><a class="page-link" onclick="toPage('${lastPageAPI}',${lastPage})">${lastPage}</a></li>`}
        <li class="page-item"><a class="page-link active">${pageIndex}</a></li>
        ${data.length < 8 ? '' : `<li class="page-item"><a class="page-link"  onclick="toPage('${nextPageAPI}',${nextPage})">${nextPage}</a></li>`}
    `
    let pageBackBtnHTML = `
        ${pageIndex == 1 ? '' : `
        <li class="page-item" id="pageBackBtn" onclick="toPage('${lastPageAPI}',${lastPage})">
            <a class="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`}
    `
    let pageForwarBtnHTML = `
        ${data.length < 8 ? '' : `
        <li class="page-item" id="pageForwardBtn" onclick="toPage('${nextPageAPI}',${nextPage})">
            <a class="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
        </li>`}
    `
    let html = pageBackBtnHTML + pageNumberHTML + pageForwarBtnHTML
    document.getElementById("pagination").innerHTML = html
}

function toPage(url, pageNumber) {
    let currenURL = window.location.href
    let modifiedURL = new URL(currenURL)

    modifiedURL.searchParams.set('pageIndex', pageNumber)
    window.history.pushState({ path: modifiedURL.toString() }, '', modifiedURL.toString())

    fetchMusicList(url)
}

function handleAPI() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageIndex = urlParams.get('pageIndex')
    const sortBy = urlParams.get('sortBy')
    const sort = urlParams.get('sort')
    const search = urlParams.get('search')
    const API = genAPI(pageIndex, sortBy, sort, search)
    fetchMusicList(API)
}

document.querySelector("#sortByTitleAsc").addEventListener("click", (e) => {
    // dropdownMenuButton
    let text = document.getElementById('sortByTitleAsc').innerText
    document.getElementById('dropdownMenuButton').innerText = text
    let currenURL = window.location.href
    let modifiedURL = new URL(currenURL)
    modifiedURL.searchParams.set('sortBy', 'title')
    modifiedURL.searchParams.set('sort', 'asc')
    window.history.pushState({ path: modifiedURL.toString() }, '', modifiedURL.toString());
    handleAPI()
})
document.querySelector("#sortByTitleDesc").addEventListener("click", (e) => {
    let text = document.getElementById('sortByTitleDesc').innerText
    document.getElementById('dropdownMenuButton').innerText = text
    let currenURL = window.location.href
    let modifiedURL = new URL(currenURL)
    modifiedURL.searchParams.set('sortBy', 'title')
    modifiedURL.searchParams.set('sort', 'desc')
    window.history.pushState({ path: modifiedURL.toString() }, '', modifiedURL.toString());
    handleAPI()
})

document.querySelector("#notSort").addEventListener("click", (e) => {
    let text = document.getElementById('notSort').innerText
    document.getElementById('dropdownMenuButton').innerText = text
    let currenURL = window.location.href
    let modifiedURL = new URL(currenURL)
    modifiedURL.searchParams.delete('sortBy')
    modifiedURL.searchParams.delete('sort')
    window.history.pushState({ path: modifiedURL.toString() }, '', modifiedURL.toString());
    handleAPI()
})

document.querySelector('#seachInput').addEventListener('input', (e) => {
    // e.preventDefault()
    let search = document.querySelector('#seachInput').value
    let currenURL = window.location.href
    let modifiedURL = new URL(currenURL)
    if (search) {
        modifiedURL.searchParams.set('search', search)
    } else {
        modifiedURL.searchParams.delete('search')
    }
    window.history.pushState({ path: modifiedURL.toString() }, '', modifiedURL.toString());
    handleAPI()
})

function genAPI(pageIndex, sortBy, sort, search) {
    let pageIndexQuery
    let sortByQuery
    let sortQuery
    let searchQuery

    if (pageIndex) {
        pageIndexQuery = `pageIndex=${pageIndex}`
    } else {
        pageIndexQuery = ``
    }

    if (sortBy) {
        sortByQuery = `sortBy=${sortBy}`
    } else {
        sortByQuery = ``
    }

    if (sort) {
        sortQuery = `sort=${sort}`
    } else {
        sortQuery = ``
    }

    if (search) {
        searchQuery = `search=${search}`
    } else {
        searchQuery = ``
    }

    let query = [pageIndexQuery, sortByQuery, sortQuery, searchQuery]
    let queryStr = query.filter(Boolean).join('&');

    return 'http://localhost:9000/api/music?' + queryStr
}

