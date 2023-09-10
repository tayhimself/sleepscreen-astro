//import html2canvas from "html2canvas"
import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js").then((html2canvas) => {

document.getElementById("screenshot").addEventListener("click", function (e) {
  /*
    // if we want a preview of the screenshot
    const screenshotImage = new Image()
    screenshotImage.src = canvas.toDataURL("image/png")
    const screenshotResultDiv = document.getElementById("screenshot-result")
    screenshotResultDiv.innerHTML = ""
    screenshotResultDiv.appendChild(screenshotImage)
    */

  document.getElementById("screenshot-modal").showModal()
})

document.getElementById("download-screenshot").addEventListener("click", function (e) {
  html2canvas(document.getElementById("save-content")).then((canvas) => {
    const img = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "screener.png"
    link.href = img
    link.click()
  }).catch((err) => {
    console.log(err)
  })
})
}).catch((err) => {
  console.log(err)
});

