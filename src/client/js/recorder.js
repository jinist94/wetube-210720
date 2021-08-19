


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let recorder;
let stream;
let videoFile;

const handleDownload = () =>{
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
    
}
const handleStart = () =>{
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = "true";
        video.play();

    };
    recorder.start();
    console.log(recorder);

}

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true,});
    video.srcObject = stream;
    video.play();
}
init();
startBtn.addEventListener("click", handleStart);