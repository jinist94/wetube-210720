console.log("Video Player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

console.log(play,mute,time,volume);

let volumeValue = 0.5;
video.volume = volumeValue;


const handlePlayClick = (e) =>{
    console.log("click")
    if(video.paused){
        video.play();
        
    }else {
        video.pause();
        
    }
    playBtn.innerText = video.paused ? "play" : "pause"
}
const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target: {value} } = event;
    //console.log (event.target.value);
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;

}
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);