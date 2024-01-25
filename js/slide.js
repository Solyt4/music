import debaune from "./debounce.js";
export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = "ativo";
  }
  transition(active) {
    this.slide.style.transition = active ? "transform 2s" : "";
  }
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0,0)`;
  }
  updadePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }
  onStart(event) {
    let movType;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movType = "touchmove";
    }
    this.wrapper.addEventListener(movType, this.onMove);
    this.transition(false);
  }
  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updadePosition(pointerPosition);
    this.moveSlide(finalPosition);
    const isLastSlide = this.index.active === this.slideArray.length - 1;
    const isFirstSlide = this.index.active === 0;
    if (this.dist.movement > 0 && isLastSlide) {
      this.changeSlide(0);
    } else if (this.dist.movement < 0 && isFirstSlide) {
      this.changeSlide(this.slideArray.length - 1);
    }
  }
  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.chengeSlideOnEnd();
    const isLastSlide = this.index.active === this.slideArray.length - 1;
    const isFirstSlide = this.index.active === 0;
    if (this.dist.movement > 0 && isLastSlide) {
      this.changeSlide(0);
    } else if (this.dist.movement < 0 && isFirstSlide) {
      this.changeSlide(this.slideArray.length - 1);
    }
  }
  chengeSlideOnEnd() {
    if (this.dist.movement > 100 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -100 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      switch (repeatBtn.innerText) {
        case "repeat":
          this.changeSlide(this.index.active);
          break;
        case "shuffle":
          this.activeNextSlideShuffle();
          break;
        case "repeat_one":
          this.repeatOne();
          break;
      }
    }
  }
  activeNextSlideShuffle() {
    let randIndex = Math.floor(Math.random() * musicKeny.length + 1);
    do {
      randIndex = Math.floor(Math.random() * musicKeny.length + 1);
    } while (musicIndex == randIndex);
    musicIndex = randIndex;
    loadMusic(musicIndex);
    playMusic();
  }
  repeatOne() {
    mainAudio.currentTime = 0;
    loadMusic(musicIndex);
    playMusic();
  }
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }
  //Slides config
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }
  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass)
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }
  activePrevSlide() {
    const lastIndex = this.slideArray.length - 1;

    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
      prevMusic(this.index.prev + 2);
    } else {
      // Se chegar à primeira, volta para a última
      this.changeSlide(lastIndex);
      prevMusic(lastIndex + 2);
    }
  }

  activeNextSlide() {
    const lastIndex = this.slideArray.length - 1;

    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
      nextMusic(this.index.next);
    } else {
      this.changeSlide(0);
      nextMusic(1);
    }
  }
  /*     activePrevSlide() {
      if (this.index.prev !== undefined) {
        this.changeSlide(this.index.prev);
        prevMusic(this.index.prev + 2);
      }
    }
    activeNextSlide() {
      if (this.index.next !== undefined) {
        this.changeSlide(this.index.next);
        nextMusic(this.index.next);
      }
    } */
  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }
  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.onResize = debaune(this.onResize.bind(this), 200);
  }
  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.changeSlide(4);
    loadMusic(5);
    this.addResizeEvent();
    return this;
  }
}
export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }
  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
}
const musicc = document.querySelector(".music-bar"),
  musicImg = musicc.querySelector(".music-img"),
  musicNam = musicc.querySelector(".music-nam"),
  musicArt = musicc.querySelector(".music-art"),
  tempmin = musicc.querySelector(".temp-min"),
  tempmax = musicc.querySelector(".temp-max"),
  mainAudio = musicc.querySelector("#main-audio"),
  progressBar = musicc.querySelector(".bar"),
  progressArea = musicc.querySelector(".conteiner-bar"),
  pausePlay = musicc.querySelector(".pause"),
  next = musicc.querySelector(".next"),
  previous = musicc.querySelector(".prev"),
  refresh = musicc.querySelector(".refresh"),
  shuffle = musicc.querySelector(".shuffle"),
  slideVol = musicc.querySelector("span.volume-inco"),
  rangeThumb = document.getElementById("range-thumb"),
  rangeNumber = document.getElementById("range-number"),
  rangeLine = document.getElementById("range-line"),
  rangeInput = document.getElementById("range-input"),
  slide = document.querySelector(".slide");
let musicIndex = musicKeny.length + 4;
window.addEventListener("load", () => {
  loadMusic(musicIndex);
});
function loadMusic(indexNumb) {
  if (musicKeny[indexNumb - 1]) {
    musicNam.innerText = musicKeny[indexNumb - 1].name;
    musicArt.innerText = musicKeny[indexNumb - 1].artist;
    musicImg.setAttribute(
      "style",
      `background: url(./img/musicasicons/${
        musicKeny[indexNumb - 1].src
      }.jpg) no-repeat center; width: 60px; height: 60px; background-size: cover;`
    );
    mainAudio.src = `./musics/kenye/${musicKeny[indexNumb - 1].src}.mp3`;
  }
}
function playMusic() {
  musicc.classList.add("paused");
  pausePlay.innerText = "pause";
  mainAudio.play();
}
document.addEventListener("keydown", (w, a) => {
  if (w.code === "Space" || w.code === "Enter") {
    if (musicc.classList.contains("paused")) {
      pauseMusic();
    } else {
      playMusic();
    }
  }
});
function pauseMusic() {
  musicc.classList.remove("paused");
  pausePlay.innerText = "play_arrow";
  mainAudio.pause();
}
function prevMusic(element) {
  loadMusic(element);
  playMusic();
}
function nextMusic(element) {
  loadMusic(element);
  playMusic();
}
previous.addEventListener("click", () => {
  prevMusic();
});
next.addEventListener("click", () => {
  nextMusic();
});
pausePlay.addEventListener("click", () => {
  const isMusicPlay = musicc.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
});
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  let musicCurrentTime = tempmin,
    musicDuartion = tempmax;
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `/ ${totalMin}:${totalSec}`;
  });
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

let isMouseDown = false;
progressArea.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  updateProgressBar(e);
});
document.addEventListener("mouseup", () => {
  if (isMouseDown) {
    isMouseDown = false;
    playMusic();
  }
});
document.addEventListener("mousemove", (e) => {
  isMouseDown && updateProgressBar(e);
});
function updateProgressBar(e) {
  if (!isMouseDown) return;
  const { left, width } = progressArea.getBoundingClientRect();
  const clickedOffsetX = e.clientX - left;
  const songDuration = mainAudio.duration;
  const progressPercentage = (clickedOffsetX / width) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  mainAudio.currentTime = (clickedOffsetX / width) * songDuration;
}
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
      seek(-10);
    } else if (e.code === "ArrowRight") {
      seek(10);
    }
  });
});
function seek(seconds) {
  mainAudio.currentTime += seconds;
}
const repeatBtn = musicc.querySelector(".refresh");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "shuffle":
      slide.activeNextSlideShuffle();
      break;
    case "repeat_one":
      slide.repeatOne();
      break ;
  }
});
function vomumeMusic() {
  slideVol.addEventListener("click", () => {
    let value = slideVol.innerText;
    switch (value) {
      case "volume_up":
        slideVol.innerText = "volume_off";
        mainAudio.volume = 0;
        break;
      case "volume_off":
        mainAudio.volume = rangeInput.value / 100;
        slideVol.innerText = "volume_up";
    }
  });
  const rangeInputSlider = () => {
    const volumevalue = rangeInput.value / 100;
    mainAudio.volume = volumevalue;
    rangeNumber.textContent = rangeInput.value;
    const thumbPosition = rangeInput.value / rangeInput.max,
      space = rangeInput.offsetWidth - rangeThumb.offsetWidth;
    rangeThumb.style.left = thumbPosition * space - 0.5 + "px";
    rangeLine.style.width = rangeInput.value + "%";
    if (volumevalue <= 0) {
      slideVol.innerText = "volume_off";
    } else {
      slideVol.innerText = "volume_up";
    }
  };
  rangeInput.addEventListener("input", rangeInputSlider);
  rangeInputSlider();
}
vomumeMusic();
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    adjustVolume(0.1);
  } else if (e.code === "ArrowDown") {
    adjustVolume(-0.1);
  }
});
function adjustVolume(change) {
  var newVolume = mainAudio.volume + change;
  newVolume = Math.max(0, Math.min(1, newVolume));
  mainAudio.volume = newVolume;
  rangeThumb.style.left = newVolume * 100 + "px";
  rangeLine.style.width = newVolume * 100 + "%";
  rangeNumber.textContent = String(newVolume * 100).substr(0, 2);
}
