"use strict"
// IMPORT DATA ---------------------------------
import { resultData } from "./result.js"
import { questions } from "./question.js"

// SELECT ELEMENTS ---------------------------------
const r = document.querySelector(":root")
const startPage = document.querySelector(".section--start")
const questionPage = document.querySelector(".section--question")
const resultPage = document.querySelector(".section--result")
const btnStart = document.querySelector(".button-start")
const btnInfo = document.querySelector(".button-container")
const phone = document.querySelector(".main")
const informationSlide = document.querySelector(".information-container")
const btnArrow = document.querySelector(".button-arrow")
const bgMusic = document.querySelector(".bg-music")
const btnSoundController = document.querySelector(".sound-group")

let questionIndex = 0
let score = 0

// BG MUSIC SETTING -----------------------------------------

const getRandomNumber = () => Math.ceil(Math.random() * 5)
bgMusic.src = `./assets/audios/bg-${getRandomNumber()}.mp3`
bgMusic.volume = 0.2

// FUNCTIONALTY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// SHOW INFORMATION SLIDE ------------------------------------
// SECTION
resultPage.addEventListener("click", (e) => {
  if (e.target.closest(".button-restart")) restart()
  if (e.target.closest(".button-screenshot")) screenshot()
})

const showInformation = () => {
  phone.classList.toggle("phone-movement")
  informationSlide.classList.toggle("content-movement")
  btnArrow.classList.toggle("arrow-animation")
}

btnInfo.addEventListener("click", showInformation)
// ----------------------------------------------------------

// START THE TEST -------------------------------------------
// SECTION
const startTest = () => {
  startPage.classList.add("hidden")
  questionPage.classList.remove("hidden")
  renderQuestion()
}
btnStart.addEventListener("click", startTest)
// ----------------------------------------------------------

// RENDER QUESTIONS -----------------------------------------
// SECTION
const renderQuestion = () => {
  const { question, answers } = questions[questionIndex]
  const markup = `
    <div class="wrapper">
      <h2 class="question">${question}</h2>
      <div class="answers">
        <ul class="answers__list">
        ${answers
          .map(
            ({ text, score }, i) => `
            <li class="answers__item " data-score="${score}" >
            <div class="answer-number">${i + 1}</div>
            <div class="answer">${text}</div>
          </li>
          `
          )
          .join("")}
        </ul>
      </div>
    </div>
  `

  questionPage.innerHTML = ``
  questionPage.insertAdjacentHTML("beforeend", markup)
  questionPage.style.backgroundImage = `url('./assets/images/question/qp-${
    questionIndex + 1
  }.png')`
}

const nextQuestion = (e) => {
  const target = e.target.closest("li")

  if (questionIndex === questions.length - 1) {
    showResult(score)
    return
  }

  score += +target.dataset.score
  questionIndex++
  renderQuestion()
}

questionPage.addEventListener("click", (e) => nextQuestion(e))

// -----------------------------------------------------------

// RENDER RESULT ---------------------------------------------
// SECTION
const renderStar = function (n) {
  // check if there is half star
  let isHalf = false
  if (n % 1 !== 0) isHalf = true

  // if just 0.5 star
  if (n < 1) {
    return '<i class="fas fa-star-half-alt"></i>'
  }

  const stars = Array.from({ length: Math.floor(n) })

  let starText =
    stars.map((_) => `<i class="fas fa-star"></i>`).join("") +
    (isHalf ? '<i class="fas fa-star-half-alt"></i>' : "")

  return starText
}

const renderResult = function (result) {
  const resultIndex = Math.round((result - 10) / 2)

  const { id, name, pairs, description, trekRecommend, color, photo } =
    resultData[resultIndex]

  const markup = `
    <div class="wrapper">
      <div class="image-container">
        <img src="./assets/images/rubbish-photos/${id}.png" alt="${name} photo">
      </div>
      <h2 class="result--name">${name}</h2>
      <h3 class="result--ranking heading--3">山徑垃圾 排行NO.${id}</h3>
      <p class="result--description">
        ${description}
      </p>
      <div class="result--pairs">
        <div class="pair-group pair-group--best">
          <h4 class="pair-title">最佳拍檔</h4>
          <div class="pairs-img">
            <img src="./assets/images/rubbish-photos/${
              pairs.best.id
            }.png" alt="${pairs.best.name} photo">
          </div>
        </div>
        <div class="pair-group pair-group--worst">
          <h4 class="pair-title">酒肉朋友</h4>
          <div class="pairs-img">
            <img src="./assets/images/rubbish-photos/${
              pairs.worst.id
            }.png" alt="${pairs.worst.name} photo">
          </div>
        </div>
      </div>
      <div class="trek-recommendation-group">
        <h3 class="heading--3">最啱你嘅行山路線</h3>
        <div class="trek-recommendation">
          <div class="mountain-group">
            <i class="fas fa-map-marker-alt"></i>
            <h4 class="mountain-name">${trekRecommend.name}</h4>
          </div>
          <div class="trek-ranking-group">
            <div class="trek-difficulty trek-group">
              <span class="difficulty-text">難度</span>
              <div class="difficulty-stars">
                ${renderStar(trekRecommend.difficulty)}
              </div>
            </div>
            <div class="trek-view trek-group">
              <span class="view-text">景觀</span>
              <div class="view-stars">
                ${renderStar(trekRecommend.view)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="trek-photo-group">
        <h3 class="heading--3">參考圖</h3>
        <div
          id="carouselExampleIndicators"
          class="carousel slide"
          data-bs-ride="true"
        >
          <div class="carousel-indicators">
          ${Array.from(
            { length: photo },
            (_, i) => `
            <button
              type="button button-carousel"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="${i}"
              class=${i === 0 ? "active" : ""}
              aria-current="true"
              aria-label="Slide ${i + 1}"
            ></button>
          `
          ).join("")}
          </div>
          <div class="carousel-inner">
          ${Array.from(
            { length: photo },
            (_, i) => `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
              <img
                src="./assets/images/mountain-images/${trekRecommend.name}/${
              i + 1
            }.jpg"
                class="d-block w-100 h-100"
                alt="trek-photo"
              />
            </div>
          `
          )}
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              class="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              class="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="button-group">
        <button class="button-restart button">再嚟一次</button>
        <button class="button-screenshot button">影張靚相</button>
      </div>
    </div>
  `

  resultPage.innerHTML = ``
  resultPage.style.backgroundImage = `url('./assets/images/result-page-bg/result-${id}.png')`

  // change the theme color
  r.style.setProperty("--color-primary", color)
  resultPage.insertAdjacentHTML("beforeend", markup)
}

const showResult = (score) => {
  questionPage.classList.add("hidden")
  resultPage.classList.remove("hidden")

  renderResult(score)
}

// RESTART THE TEST -----------------------------------------------
const restart = () => {
  startPage.classList.remove("hidden")
  questionPage.classList.add("hidden")
  resultPage.classList.add("hidden")

  score = 0
  questionIndex = 0
}

// CONTROL BG MUSIC -----------------------------------------------
const controlBGMusic = function () {
  if (bgMusic.classList.contains("music-play")) {
    bgMusic.pause()
    btnSoundController.innerHTML = `<i class="fas fa-volume-mute"></i>`
  } else {
    bgMusic.play()
    btnSoundController.innerHTML = `<i class="fas fa-volume-up"></i>`
  }
  bgMusic.classList.toggle("music-play")
}

btnSoundController.addEventListener("click", controlBGMusic)
