import fetch from "node-fetch";

console.log("Video Player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovemenTimeout = null;


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

const formatTime = (seconds) => 
    new Date(seconds*1000).toISOString().substr(14,5);


const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration); //when loaded video, we can get max
}
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) =>{
    const {target: {value} } = event;
    video.currentTime = value;
}

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText= "Enter Full Screen";
    }else {

        videoContainer.requestFullscreen();
        fullScreenBtn.innerText= "Exit Full Screen";
    }
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () =>{
    if(controlsTimeout){ //if it is number
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovemenTimeout){
        clearTimeout(controlsMovemenTimeout);
        controlsMovemenTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovemenTimeout = setTimeout(hideControls, 3000);

    //ㅁㅏ우스 무브할때 데이터를주고 마우 스 무브가끝나면 데이터를 null로 만들어줌.
}
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
}
const handleVideoClick = () => {
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
}
const handleKeydown = (event) => {
    if(event.key === " "){
        if(video.paused){
            video.play();
        }else{
            video.pause();
        }
    }
}

const handleEnded = () =>{
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {method : "POST"});
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded );
video.addEventListener("click", handleVideoClick);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);

window.addEventListener("keydown", handleKeydown);