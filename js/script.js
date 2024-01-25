const addslide = document.querySelector(".slide");
for (let i = 0; i < musicKeny.length; i++) {
  let divmusic = `<li class="music-caixa">
  <div class="music-img-slide" style="background: url(./img/musicasicons/${musicKeny[i].img}.jpg) no-repeat center;width: 250px;height: 250px;background-size: cover;"></div>
  <div>
  <audio class="${musicKeny[i].src}" src="musics/kenye/${musicKeny[i].src}.mp3"></audio>
    <p class="music-nam-slide">${musicKeny[i].name}</p>
    <p class="music-art-slide">${musicKeny[i].artist}</p>
  </div>
</li>`;
  addslide.insertAdjacentHTML("beforeend", divmusic);
}
import { SlideNav } from "./slide.js";
const slide = new SlideNav(".slide", ".wrapper");
slide.init();
slide.addArrow(".prev", ".next");
