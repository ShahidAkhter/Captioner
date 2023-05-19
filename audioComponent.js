const maxValueRange = 10000;
const masterPlay = document.getElementById('masterPlay');
const myProgressBar = document.getElementById('progress-bar');
const timeDuration = document.getElementById('time-duration');

const pause = 'assets/appImgs/pause-solid.svg';
const play = 'assets/appImgs/play-solid.svg';

// let audio = new Audio('C:/Users/shahi/OneDrive/Desktop/Projects/WebDev/HTML,CSS,JS/MyPodcastsApp/assets/sounds/Grew Up At Midnight.mp3');
let audio=new Audio();
let audioLengthInt = 0;

const getPodcastLength = (audioLength) => {
    const audioLen = Math.floor(audioLength);
    const [hours, minutes, seconds] = [Math.floor(audioLen / 3600), Math.floor((audioLen % 3600) / 60), audioLen % 60];
    const timeArr = [hours, minutes, seconds].map((val) => val.toString().padStart(2, '0'));
    return (hours > 0 ? `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}` : `${timeArr[1]}:${timeArr[2]}`);
};

const masterPlayerFunc = () => {
    if (audio.paused || audio.currentTime <= 0) {
        audio.play();
        masterPlay.src = pause;
    } else {
        audio.pause();
        masterPlay.src = play;
    }
};

audio.addEventListener('loadedmetadata', () => {
    audioLengthInt = audio.duration;
    timeDuration.innerText = getPodcastLength(audioLengthInt);
});

masterPlay.addEventListener('click', masterPlayerFunc);

myProgressBar.addEventListener('click', (event) => {
    const progressPercentage = event.offsetX / myProgressBar.clientWidth;
    audio.currentTime = progressPercentage * audio.duration;
    currentTimeDur.innerText = getPodcastLength(audio.currentTime);
    if (audio.ended) masterPlay.src = play;
});

audio.addEventListener('timeupdate', () => {
    const audioCurrentTimeInt = Math.floor(audio.currentTime);
    const progress = Math.floor((audioCurrentTimeInt / audio.duration) * maxValueRange);
    currentTimeDur.innerText = getPodcastLength(audioCurrentTimeInt);
    myProgressBar.value = progress;
    if (audio.ended) masterPlay.src = play;
});

myProgressBar.addEventListener('change', () => {
    const audioCurrentTime = (myProgressBar.value * audio.duration) / maxValueRange;
    currentTimeDur.innerText = getPodcastLength(audioCurrentTime);
    if (audio.ended) masterPlay.src = play;
});