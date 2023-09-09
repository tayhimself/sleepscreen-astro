window.onload = function() {
  document.getElementById('restart').addEventListener('click', function(e) {
    // will not redirect without the preventDefault because the event listener is in a container div
    // with anchor tags inside
    e.preventDefault()
    const home = this.dataset.home
    window.confirm('Are you sure you want to restart the screener?') ? window.location.href=home : null
  })
}