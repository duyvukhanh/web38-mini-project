function setTime(second) {
    if (second < 10) {
        return `00:0${second}`
    }
    if (second < 60) {
        return `00:${second}`
    }
    let minute = Math.floor(second / 60)
    let secondLeft = second - minute * 60
    if (minute < 10 && secondLeft < 10) {
        return `0${minute}:0${secondLeft}`
    }
    if (minute < 10 && secondLeft < 60) {
        return `0${minute}:${secondLeft}`
    }
    if (minute >= 10 && secondLeft < 10) {
        return `${minute}:0${secondLeft}`
    }
    if (minute >= 10 && secondLeft < 60) {
        return `${minute}:${secondLeft}`
    }
}

function addDurationOfCurrentTrack() {
    let audio = document.querySelector('#audio')
    let durationTime = Math.floor(audio.duration)
    document.querySelector('#durationTime').innerHTML = setTime(durationTime)
}

function addEventToPlayBtn() {
    document.querySelector('#playBtn').addEventListener('click', (e) => {
        let playBtn = document.querySelector('#playBtn')
        let playBtnClassName = playBtn.className
        if (playBtnClassName.includes('play')) {
            pauseToPlay()
        } else {
            playToPause()
        }
    })
}

function playToPause() {
    let playBtn = document.querySelector('#playBtn')
    playBtn.className = 'far fa-play-circle'
    let audio = document.querySelector('#audio')
    audio.pause()
    document.querySelector('#trackImg').className = "spin pause-spin"
}

function pauseToPlay() {
    let playBtn = document.querySelector('#playBtn')
    playBtn.className = 'far fa-pause-circle'
    let audio = document.querySelector('#audio')
    audio.play()
    document.querySelector('#trackImg').className = "spin"
}

function onTimeUpdateAudio() {
    audio.addEventListener('timeupdate', () => {
        let audio = document.querySelector('#audio')
        let durationTime = Math.floor(audio.duration)
        addDurationOfCurrentTrack()
        let currentTime = Math.floor(audio.currentTime)
        let currentTimeString = setTime(currentTime)
        document.querySelector('#currentTime').innerHTML = currentTimeString
        let durationLength = document.querySelector('#durationOfTrack').offsetWidth
        let currentPosition = Math.floor(Math.floor(currentTime * durationLength) / durationTime)
        document.querySelector('#currentDot').style.left = currentPosition.toString() + 'px'
        updatePlayer()
        updateVolume()
    }) 
}

function updateVolume() {
    let audio = document.getElementById('audio')
    let volume = audio.volume
    let fullVolWidth = document.getElementById('fullVol').offsetWidth
    let volumePos
    if (fullVol) {
        volumePos = (fullVolWidth / 100) * (volume * 100)
    }
    document.getElementById('currentVol').style.left = `${volumePos}px`
    let background = `linear-gradient(to right, #212529 ${volume * 100}%,#bcbcbc ${volume * 100}%, #bcbcbc)`
    document.getElementById('fullVol').style.background = background
}

function updatePlayer() {
    let player = document.querySelector('#durationOfTrack')
    let audio = document.querySelector('#audio')
    let currentTime = audio.currentTime
    let duration = audio.duration
    let currentTimePercent = ((currentTime / duration) * 100).toFixed(2)
    let background = `linear-gradient(to right, #212529 ${currentTimePercent}%,#bcbcbc ${currentTimePercent}%, #bcbcbc)`
    player.style.background = background
}

function assignTrack(id) {
    fetchOneTrack(genGetOneTrackAPI(id))
    toScreen2()
}

function nextTrack(nextTrackId) {
    // let nextTrackId = document.getElementsByClassName("track-block")[8].id;
    let audio = document.getElementById('audio')
    let new_audio = audio.cloneNode(true);
    audio.parentNode.replaceChild(new_audio, audio);
    audio = document.getElementById('audio')
    onTimeUpdateAudio()
    assignTrack(nextTrackId)
}

function prevTrack(prevTrackId) {
    let audio = document.getElementById('audio')
    let new_audio = audio.cloneNode(true);
    audio.parentNode.replaceChild(new_audio, audio);
    audio = document.getElementById('audio')
    onTimeUpdateAudio()
    assignTrack(prevTrackId)
}

document.getElementById('prevBtn').addEventListener('click',(e) => {
    let status = JSON.parse(localStorage.getItem('status'))
    if ( status ) {
        if ( status.lastTrack ) {
            prevTrack(status.lastTrack._id)
        }
    }
})
document.getElementById('nextBtn').addEventListener('click',(e) => {
    let status = JSON.parse(localStorage.getItem('status'))
    if ( status ) {
        nextTrack(status.nextTrack._id)
    }
})


function genGetOneTrackAPI(id) {
    let status = JSON.parse(localStorage.getItem('status'))
    if ( status ) {
        if ( status.lastTrack ) {
            return `http://localhost:9000/api/music/${id}?prev=${status.lastTrack._id}`
        }
    } 
    return `http://localhost:9000/api/music/${id}`
}

function handleOneResult(result) {
    document.querySelector('#trackImageToPlay').innerHTML = `
    <div class="track-image-block" id="${result._id}">
        <img id="trackImg" class="" src="../image/${result.image}.jpg" alt="">
    </div>
    `
    document.querySelector('#trackTitleToPlay').innerHTML = `${result.title}`
    document.querySelector('#trackArtistToPlay').innerHTML = `${result.artist}`
    document.querySelector('#audio').src = `../music/${result.url}.mp3`
    let status = JSON.parse(localStorage.getItem('status'))
    if ( !status ) {
        status = {}
        localStorage.setItem('status',JSON.stringify(status))
    }
    if ( status ) {
        status.lastTrack = status.currentTrack
        status.currentTrack = result
        status.nextTrack = result.nextTrack[0]
        localStorage.setItem('status',JSON.stringify(status))
    }
    handleRelativeTrack(result.nextTrack)
}

function fetchOneTrack(url) {
    getData(url)
        .then((data) => {
            handleOneResult(data)
        })
}

function handleRelativeTrack(result) {
    let content = ``
    for (let track of result) {
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
    pauseToPlay()
    showPlayBtnOnThumb()

}

function endTrack() {
    playToPause()
    let playBtn = document.querySelector('#playBtn')
    playBtn.className = 'far fa-play-circle'
    let audio = document.querySelector('#audio')
    audio.currentTime = 0
    document.querySelector('#trackImg').className = ""
    document.querySelector('#currentTime').innerHTML = "00:00"
    document.querySelector('#currentDot').style.left = 0
}


function showPlayBtnOnThumb() {
    let btns = document.getElementsByClassName('track-image')
    for (let btn of btns) {
        btn.onmouseover = function (e) {
            btn.children[1].style.zIndex = `2`
            btn.children[0].style.webkitFilter = `blur(4px)`
            btn.children[0].style.filter = `blur(4px)`
        }
        btn.onmouseleave = function (e) {
            btn.children[1].style.zIndex = `0`
            btn.children[0].style.webkitFilter = ``
            btn.children[0].style.filter = ``
        }
    }
}

document.querySelector('#player').addEventListener('click', (e) => {
    let audio = document.getElementById('audio')
    let trackDuration = audio.duration
    let player = document.querySelector('#durationOfTrack')
    let rectPlayer = player.getBoundingClientRect();
    let xPlayer = rectPlayer.left
    let xCursor = e.pageX
    let playerWidth = player.offsetWidth
    let DotPos = xCursor - xPlayer
    let currentTime = trackDuration * DotPos / playerWidth
    console.log(xCursor)
    console.log(xPlayer)

    audio.currentTime = Math.floor(currentTime)
})

document.querySelector('#volControl').addEventListener('click', (e) => {
    let audio = document.getElementById('audio')
    let maxVol = 100
    let volControl = document.querySelector('#volControl')
    let rectVolControl = volControl.getBoundingClientRect();
    let xVolControl = rectVolControl.left
    let xCursor = e.pageX
    let volControlWidth = volControl.offsetWidth
    let DotPos = xCursor - xVolControl
    let currentVol = maxVol * DotPos / volControlWidth
    audio.volume = (currentVol / 100).toFixed(2)
})

