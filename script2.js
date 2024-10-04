console.log("Hello");

let currentSong = new Audio();
let songtrouble = [];
let astrouble;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    //troubleshoot
    astrouble = as;
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("/songs/")[1]);
            //troubleshooting
            songtrouble.push(element.href);
        }

    }
    return songs;
}

function trouble(){
    console.log('These are the urls');

    console.log(songtrouble);
    for (let index = 0; index < astrouble.length; index++) {
        const element = astrouble[index];
        console.log('Printing element '+ index);
        
        console.log(element.href);
        console.log(element.href.split("/songs/")[1]);
        
    }
    
    
}

trouble();

const playMusic = (track)=>{
    // let audio = new Audio("/songs/"+ track);
    currentSong.src = "/songs/" + track;
    currentSong.play();
    console.log("This song's url: "+ currentSong.src)
}

async function main() {
    //Get the list of songs
    currentSong = new Audio();
    let songs = await getSongs();
    console.log(songs);
    //shows all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
         <li>
                            <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("%26", " ").replaceAll("%5D", " ").replaceAll("%5B", " ")}</div>
                                <div style="color: grey">Mainak</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="playnow.svg" alt="">
                            </div>
        </li>`;
    }



    // Play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    // console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // The duration variable now holds the duration (in seconds) of the audio clip
    // });

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e=>{

            console.log(element.querySelector(".info").firstElementChild.innerHTML);
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });
}

main();

