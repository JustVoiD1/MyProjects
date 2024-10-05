
let songs;
let songarr = [];
let folder;
let freshsong;
let trname = "";
let currFolder;
let html2;
function formatSeconds(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to always have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:




let currentSong = new Audio();

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`./${folder}`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

    //shows all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {

        freshsong = song;


        freshsong = freshsong.replaceAll("%20", " ").replaceAll("%5D", " ").replaceAll("%5B", " ");
        let freshsong2 = freshsong;
        freshsong2 = freshsong2.replaceAll("%26", "&")
        // console.log(freshsong);



        // console.log('song print complete');



        songUL.innerHTML = songUL.innerHTML + `
                <li>
                    <img src="./img/music.svg" class="invert" alt="">
                    <div class="info">
                        <div>${freshsong2}</div>
                        <div style="color: grey">${freshsong2.split(" -")[0]}</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="./img/playnow.svg" alt="">
                    </div>
                </li>`;

        // freshsong = freshsong.replaceAll("%26", "&");
    }



    // Play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    // console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // The duration variable now holds the duration (in seconds) of the audio clip
    // });
    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            let html = element.querySelector(".info").firstElementChild.innerHTML;
            html2 = html;
            html2 = html2.replaceAll("&amp;", "%26")
            console.log(html2);
            playMusic(html2);
        })
    });
    return songs;
}
//Playing songs
const playMusic = (track) => {
    // let audio = new Audio("/songs/"+track);
    currentSong.src = `./${currFolder}/` + track
    currentSong.play();
    player.src = "./pause.svg";

    document.querySelector(".playbar").style.display = "flex"; // Show the playbar

    console.log(currentSong.src);
    trname = track;
    trname = trname.replaceAll(".mp3", "").replaceAll("%20", " ").replaceAll("%5D", " ").replaceAll("%5B", " ").replaceAll("%26", "&amp");
    document.querySelector(".songinfo").innerHTML = trname;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
const hidePlaybar = () => {
    document.querySelector(".playbar").style.display = "none"; // Hide the playbar
}

async function displayAlbums() {
    console.log('displaying albums');


    let a = await fetch(`./songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    console.log(div)
    let anchors = div.getElementsByTagName("a")

    // console.log(anchors)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // if(e.href.includes("/songs") && folder[0] !== '127.0.0.1:5500'){
        if (e.href.includes("/songs/")) {
            console.log(index)
            console.log(e.href)
            folder = e.href.split("/").slice(-2);
            // folder = e.href.split("/").slice(-2).join('/');
            console.log(folder)


            let b = await fetch(`./${folder[0]}/${folder[1]}/info.json`);
            let response = await b.json();
            console.log('response is ');
            let cardcontainer = document.querySelector(".cardcontainer")
            console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder[1]}" class="card rounded">
 
                         <div class="play rounded">
                             <img src="./img/play2.svg" alt="" srcset="">
 
                         </div>
                         <img src="./songs/${folder[1]}/cover.jpg" alt="">
 
                         <h2>${response.title}</h2>
                         <p>${response.Description}</p>
                     </div>`

        }

        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                console.log(item, item.currentTarget, item.currentTarget.dataset)
                console.log(`fetching songs`)
                songs = await getSongs(`./songs/${item.currentTarget.dataset.folder}`)
                console.log(songs)
                playMusic(songs[0])

            })
        })
    }


    //Load the playlist when clicked


    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     e.addEventListener("click", async item => {
    //         console.log(item, item.currentTarget, item.currentTarget.dataset)
    //         console.log(`fetching songs`)
    //         let songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    //         console.log(songs)

    //     })
    // })
}


async function main() {

    hidePlaybar();
    //Get the list of songs
    let currentSong = new Audio();
    await getSongs(`./songs/brooks`);
    // console.log(songs);

    //Display all the albums on the page
    displayAlbums();

}

// let play = document.getElementById("player")
//attach event listeners to play previous and next
player.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        player.src = `./pause.svg`;
    }
    else {
        currentSong.pause();
        player.src = "./play.svg"

    }

})

// Listen to timeupdate event
currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    document.querySelector(".songtime").innerHTML = `${formatSeconds(Math.floor(currentSong.currentTime))} / ${formatSeconds(Math.floor(currentSong.duration))}`;


})

//Adding event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = (percent) * 100 + "%";
    currentSong.currentTime = percent * currentSong.duration;
})

//Adding event listener to hamburger button
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
})
//Adding event listener to close hamburger button
document.querySelector(".closeham>img").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
})
//Adding event listener to prevsong
document.querySelector("#prevsong").addEventListener("click", () => {
    console.log("prevsong clicked");
    currentSong.pause();
    console.log(songs.indexOf(currentSong.src.split("/").slice(-1)[0]))
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if ((index - 1) >= 0) {
        playMusic(songs[index - 1]);
    }

})

//Adding event listener to nextsong
document.querySelector("#nextsong").addEventListener("click", () => {
    console.log("nextsong clicked");
    currentSong.pause();
    // console.log(songs.indexOf(currentSong.src.split("/").slice(-1)[0]))
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(index)

    if ((index + 1) < (songs.length)) {
        playMusic(songs[index + 1]);
    }

})

//Adding an event listener to volume
document.querySelector(".spacetoright").getElementsByTagName("input")[0].addEventListener("change", (e) => {

    console.log("Setting volume: " + e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
})

//Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target)
    if (e.target.src.includes("volume.svg")) {
        e.target.src = e.target.src.replace("./volume.svg", "./mute.svg")
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
        currentSong.volume = 0;
    }
    else {
        e.target.src = e.target.src.replace("./mute.svg", "./volume.svg")
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 10;
        currentSong.volume = 0.1;

    }
})


main();

