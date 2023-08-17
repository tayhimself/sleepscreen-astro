import { listeners } from "./forms.js"

let response = await fetch("../src/json/ais.json")
let data = await response.json()
let form = document.createElement("form")
form.id="ais"
document.getElementById("main").appendChild(form)
let questions = Array.from(data.questions)

// set title
let titleEls = document.querySelectorAll("title, h1")
titleEls.forEach((el) => {
  el.innerHTML = data.title
})

questions.forEach((question, i) => {
  let markup = `
  <div class="question ${i > 0 ? `hidden` : ``}">
  <!-- Eight point scale -->
  <div class="alert shadow-lg italic hover:not-italic mt-8 mb-4 mx-auto">
  <p>
  This scale is intended to record your own assessment of any sleep difficulty you might have experienced. Please, check the items below to indicate your estimate of any difficulty, <b>provided that it occurred at least three times per week during the last month</b>.
  </p>
  </div>
  <progress class="progress progress-primary w-full my-4" value=${i} max=${questions.length}></progress>
  <label class="text-semibold text-xl text-left min-w-full">
  <p class="flex items-center">
    <span class="relative flex h-3 w-3 mr-1">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
    </span>
    <span class="animate-in fade-in delay-400">
      ${question.text}
    </span>
  </p>
  </label>

  <ul class="grid grid-cols-1 gap-y-5 m-5 mx-auto w-4/5 md:w-1/2">
  ${question.options
    .map(
      (option, idx) =>
        `<li class="relative">
          <input class="sr-only peer" type="radio" value="${option.value}" name="${question.id}" id="${question.id + idx}">
          <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent peer-checked:bg-green-100 peer-checked:text-gray-600" for="${question.id + idx}">
          ${option.text}</label>
          </input>
        </li>`
    )
    .join("")}
  </ul>
  </div>`
  form.innerHTML += markup
})

listeners(form, questions)
