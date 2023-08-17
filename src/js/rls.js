import { listeners } from "./forms.js"
let response = await fetch("../src/json/rls.json")
let data = await response.json()
let form = document.createElement("form")
form.id="rls"
document.getElementById("main").appendChild(form)
let questions = Array.from(data.questions)

// set title
let titleEls = document.querySelectorAll("title, h1")
titleEls.forEach((el) => {
  el.innerHTML = data.title
})

questions.forEach((question, i) => {
  // check if data.depends exists and if so, add it to the markup
  let markup = `
  <div class="question ${i > 0 ? `hidden` : ``}">
  <progress class="progress progress-primary w-full -mt-4 mb-4" value=${i} max=${questions.length}></progress>

  <label class="text-semibold text-xl text-left min-w-full">${question.text}</label>
  `
  if (question.type === "number") {
    markup += `
    <input class="w-1/2 p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" type="number" name="${question.id}" id="${question.id}" min="${question.options.min}" max="${question.options.max}" step="${question.options.step}">
    `
  } else if (question.type === "radio") {
    markup += `
    <ul class="grid grid-cols-1 gap-y-5 m-5 mx-auto w-1/2 ">
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
    </ul>`
  } else if (question.type === "multiple") {
    markup += `
    <div class="grid grid-cols-2 gap-5 m-5 mx-auto w-4/5 ">
    ${question.fields
      .map(
        (field, idx) =>
          `<input class="p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" type="number" name="${field.id}" id="${field.id}" min="${field.options.min}" max="${field.options.max}" step="${field.options.step}"/>`
      )
    .join("")}
    </div>`
  }
  markup += `</div>`
  form.innerHTML += markup
})

listeners(form,questions)
