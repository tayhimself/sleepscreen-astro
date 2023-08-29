import { listeners } from "./forms.js"

let file = import.meta.glob("../json/ess.json")
let data = {}
for (const path in file) {
  data = await file[path]()
}
let form = document.createElement("form")
form.id="ess"
document.getElementById("main").appendChild(form)
let questions = Array.from(data.questions)

// set title
let titleEls = document.querySelectorAll('title, h1');
titleEls.forEach(el => {
  el.innerHTML = data.title
})

questions.forEach((question, i) => {
  let markup = `
  <div class="question ${i > 0 ? `hidden` : ``}">
  <p class="alert shadow-lg italic hover:not-italic mx-auto">
    The following questions refer to your usual way of life in recent times. Even if you have not done some of these activities recently, try to work out how they would have affected you and choose the column which most appropriately describes your chance of dozing.
  </p>
  <progress class="progress progress-primary w-full -mt-4 mb-4" value=${i} max=${questions.length}></progress>
  <label class="text-semibold text-xl text-left min-w-full">
  <p class="mb-2">How likely are you to doze off or fall asleep, in contrast to just feeling tired?</p>
  <p class="flex items-center">
    <span class="relative flex h-3 w-3 mr-1">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
    </span>
    <span class="animate-in fade-in delay-400">
      Situation: ${question.text}
    </span>
  </p>
  </label>

  <ul class="grid grid-cols-1 gap-y-5 m-5 mx-auto w-4/5 md:w-1/2">
  ${question.options
    .map(
      (option, idx) => `
  <li class="relative">
  <input class="sr-only peer" type="radio" value=${idx} name=${question.id} id="${question.id + idx}">
  <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent peer-checked:bg-green-100" peer-checked:text-gray-600 for="${
    question.id + idx
  }">${option}</label></li>`
    )
    .join("")}
  </ul>
  </div>`
  form.innerHTML += markup
})


listeners(form,questions)