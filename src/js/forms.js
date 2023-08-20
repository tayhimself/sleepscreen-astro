// forms.js
// Common form functions currently used in OSA and ESS exported as an IIFE
//

export const listeners = function (form, questions) {
  const previousButton = document.querySelector("#prev")
  const nextButton = document.querySelector("#next")
  const submitButton = document.querySelector("#submit")
  const tabTargets = document.querySelectorAll(".question")
  const tabPanels = document.querySelectorAll(".question")
  const spinner = document.getElementById("spinner")
  const isEmpty = (str) => !str.trim().length
  let currentStep = 0

  // Validator with debounce function to check if the input is within the range of the min and max attributes
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Add a validator to number elements to only allow numbers and check the range of the number
  let numbers = document.querySelectorAll("input[type='number']")
  numbers.forEach((number) => {
    number.addEventListener(
      "input",
      debounce((e) => {
        const min = parseInt(e.target.min, 10)
        const max = parseInt(e.target.max, 10)
        const value = parseInt(e.target.value, 10)

        if (value < min || isNaN(value) || value > max) {
          // disable the next, previous, or continue buttons
          nextButton.setAttribute("disabled", "disabled")
          previousButton.setAttribute("disabled", "disabled")
          submitButton.setAttribute("disabled", "disabled")
          // Make the input border red
          e.target.classList.add("text-red-500", "border-red-500") // Add Tailwind CSS classes for error styling
        } else {
          // enable the next, previous, or continue buttons
          nextButton.removeAttribute("disabled")
          previousButton.removeAttribute("disabled")
          submitButton.removeAttribute("disabled")
          e.target.classList.remove("text-red-500", "border-red-500") // Add Tailwind CSS classes for error styling
          e.target.classList.add("border-gray-300 focus:ring-green-500")
        }
      }),
      200
    )
  })

  // Add an event listener to the input elements that goes to the next page after 1 second when the user selects an answer

  let inputs = document.querySelectorAll("input[type='radio']")
  inputs.forEach((input) => {
    // add a click event listener to the input
    input.addEventListener("click", (event) => {
      // show the spinner
      spinner.classList.remove("hidden")
      //hide the next and previous buttons
      nextButton.classList.add("hidden")
      previousButton.classList.add("hidden")
      // go to the next page after 1.5 seconds
      setTimeout(() => {
        nextButton.click()
        spinner.classList.add("hidden")
        updateStatusDisplay()
      }, 1000)
    })
  })

  // Next: Change UI relative to the current step and account for button permissions
  nextButton.addEventListener("click", (event) => {
    event.preventDefault()
    // Hide current tab
    tabPanels[currentStep].classList.add("hidden")
    tabTargets[currentStep].classList.remove("active")
    // Show next tab if it exists. This handles the case for the last step when submit button is clicked, but we are calling nextButton.click() to go to the next step in the event listener function for the input elements to advance to the next page after 2 seconds when the user selects an answer
    if (currentStep < tabTargets.length - 1) {
      tabPanels[currentStep + 1].classList.remove("hidden")
      tabTargets[currentStep + 1].classList.add("active")
    }
    currentStep += 1
    updateStatusDisplay("next")
  })

  // Previous: Change UI relative to the current step and account for button permissions
  previousButton.addEventListener("click", (event) => {
    event.preventDefault()
    // Hide current tab
    tabPanels[currentStep].classList.add("hidden")
    tabTargets[currentStep].classList.remove("active")
    // Show the previous tab
    tabPanels[currentStep - 1].classList.remove("hidden")
    tabTargets[currentStep - 1].classList.add("active")
    currentStep -= 1
    nextButton.removeAttribute("disabled")
    updateStatusDisplay("previous")
  })

  function updateStatusDisplay(button = "") {
    if (currentStep == 0) {
      // If it's the first step, hide the previous button
      nextButton.classList.remove("hidden")
      previousButton.classList.add("hidden")
      submitButton.classList.add("hidden")
    } else if (currentStep === tabTargets.length) {
      nextButton.classList.add("hidden")
      showResults()
    } else {
      // In all other instances, display both next and previous buttons
      // check if we are dependent on any previous answers using data attributes (dataset)
      do {
        if (skipQuestion()) {
          nextButton.classList.remove("hidden")
          previousButton.classList.remove("hidden")
          submitButton.classList.add("hidden")
          // Hide current tab
          tabPanels[currentStep].classList.add("hidden")
          tabTargets[currentStep].classList.remove("active")
          // Show next tab
          if (button === "next") {
            if (currentStep < tabTargets.length - 1) {
              tabPanels[currentStep + 1].classList.remove("hidden")
              tabTargets[currentStep + 1].classList.add("active")
              currentStep += 1
            } else {
              showResults()
              break
            }
          } else if (button === "previous") {
            tabPanels[currentStep - 1].classList.remove("hidden")
            tabTargets[currentStep - 1].classList.add("active")
            currentStep -= 1
          }
        } else {
          break
        }
      } while (currentStep < tabTargets.length && currentStep > 0)

      previousButton.classList.remove("hidden")
      if (currentStep === tabTargets.length - 1) {
        // If it's the last step, hide the next button and show submit
        nextButton.classList.add("hidden")
        submitButton.classList.remove("hidden")
      } else {
        nextButton.classList.remove("hidden")
        submitButton.classList.add("hidden")
      }
    }
  }

  function skipQuestion() {
    // get the current step
    let currentStep = document.querySelector(".question.active")
    // get the inputs for the current step
    let inputs = currentStep.querySelectorAll("input")
    // we need to check multiple inputs if there is a compound question, but so far the
    let inputname = inputs[0].name
    let currentQ = questions.find((question) => question.id === inputname)
    let skip = false
    if (currentQ && currentQ.hasOwnProperty("depends")) {
      // we have a question that depends on a previous answer
      currentQ.depends.forEach((dep) => {
        // check the rule if it exists. {or, and}
        if (dep.rule) {
          // we have a rule, so we need to check the rule
          if (dep.rule === "or") {
            skip = true
            // we need to check if any of the dependent answers are true
            dep.conditions.forEach((condition) => {
              // get the dependent answers that are checked
              let answer = document.querySelector("input[name='" + condition.question + "']:checked")
              // TODO This assumes a radio button or checkbox, but we need to handle text inputs as well
              if (answer && parseInt(answer.value) === condition.value) {
                // we have a match, so we don't need to skip this question
                //console.log("answer: ", answer, "value:", answer.value, "condition: ", condition.value)
                skip = false
              }
            })
          } else if (dep.rule === "and") {
            skip = false
            dep.conditions.forEach((condition) => {
              // get the dependent answers that are checked
              let answer = document.querySelector("input[name='" + condition.question + "']:checked")
              // TODO This assumes a radio button or checkbox, but we need to handle text inputs as well
              if (answer && parseInt(answer.value) !== condition.value) {
                skip = true
                // no matches so skip this question
              }
            })
          }
        } else {
          //single condition
          // TODO only works for radio buttons and checkboxes, need to handle text inputs as well
          let answer = document.querySelector("input[name='" + dep.question + "']:checked")
          if (Object.keys(dep).includes("value") && answer && parseInt(answer.value) !== dep.value) {
            // we don't have a match, so we need to skip this question
            skip = true
          } else if (Object.keys(dep).includes("values")) {
            // we can match multiple values
            if (answer && !dep.values.includes(parseInt(answer.value))) {
              // we don't have a match, so we need to skip this question
              skip = true
            }
          }
        }
      })
    }
    return skip
  }

  // TODO remove this function
  function saveFormDataToCookie() {
    let formData = new FormData(form)
    const formDataObj = Object.fromEntries(formData.entries())
    const formDataJson = JSON.stringify(formDataObj)
    document.cookie = `formData=${encodeURIComponent(formDataJson)}`
  }

  function saveFormDataToSessionStorage() {
    let formData = new FormData(form)
    const formDataObj = Object.fromEntries(formData.entries())
    let screenStoreData = JSON.parse(sessionStorage.getItem("screenStore"))
    if (screenStoreData) {
      screenStoreData.screenStore[form.id]["values"] = formDataObj
      screenStoreData.screenStore[form.id]["completed"] = true
      sessionStorage.setItem("screenStore", JSON.stringify(screenStoreData))
    } else {
      // TODO make a restart function to redirect to the start of the form since we don't have any data
    }
  }

  /**
   * Must be run after saveFormDataToSessionStorage so that the current screen is marked as completed
   * @returns the next screen to display
   * NULL if there are no more screens to display
   */
  async function getNextScreen() {
    let screenStoreData = JSON.parse(sessionStorage.getItem("screenStore"))
    if (screenStoreData) {
      let data = await sendFormDataToAPI(new FormData(form))
      screenStoreData.screenStore[form.id]["completed"] = true
      screenStoreData.screenStore[form.id]["result"] = data[form.id]
      // write the data to session storage
      // TODO move this to a new function above or merge with saveFormDataToSessionStorage function
      sessionStorage.setItem("screenStore", JSON.stringify(screenStoreData))
      let nextScreen = Object.keys(screenStoreData.screenStore).find((key) => screenStoreData.screenStore[key]["completed"] === false)
      if (nextScreen) {
        return screenStoreData.screenStore[nextScreen]["route"]
      }
    } else {
      // TODO make a restart function to redirect to the start of the form - see above todo
    }
  }

  async function showResults() {
    // Hide the form
    form.classList.add("hidden")
    document.querySelector("div.pagination").classList.add("hidden")
    // Calculate the score
    saveFormDataToSessionStorage()
    let next = await getNextScreen()
    if (next) {
      window.location.href = "../" + next
    } else {
      window.location.href = "../results"
    }
  }

  async function sendFormDataToAPI(formData) {
    const formDataObj = Object.fromEntries(formData.entries())
    const formDataJson = JSON.stringify(formDataObj)
    let success = false
    let retry = 0
    while (!success && retry < 4) {
      try {
        const response = await fetch("https://sleephealth.partners.org/rr/" + form.id + "/", {
        //const response = await fetch("http://localhost:8000/" + form.id + "/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formDataJson,
        })
        const data = await response.json()
        if (response.ok && response.status >= 200 && response.status < 300) {
          success = true
          return await data
        } else {
          setTimeout(() => {
            console.log("retrying...")
          }, 1000 * retry)
          retry += 1
        }
      } catch (error) {
        console.error("Error:", error)
        setTimeout(() => {
          console.log("retrying...")
        }, 1000 * retry)
        retry += 1
      }
    }
    return null
  }
}
