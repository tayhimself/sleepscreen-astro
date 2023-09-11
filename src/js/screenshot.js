import html2canvas from "html2canvas"
document.getElementById("screenshot").addEventListener("click", function (e) {
      /*

  html2canvas(document.getElementById("save-content")).then((canvas) => {
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
  })
})
