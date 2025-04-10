document.addEventListener('DOMContentLoaded', () => {
  const searchBtns = document.querySelectorAll(".searchBtn")
  const searchBar = document.querySelector(".searchBar")

  const searchInput = document.getElementById("searchInput")
  const searchClose = document.getElementById("searchClose")

  for (let index = 0; index < searchBtns.length; index++) {
    searchBtns[index].addEventListener('click', () => {
      searchBar.style.visibility = 'visible'
      searchBar.classList.add('open')
      searchBtns[index].setAttribute('aria-expanded', 'true')
      searchInput.focus()
    })
    
    searchClose.addEventListener('click', () => {
      searchBar.style.visibility = 'hidden'
      searchBar.classList.remove('open')
      searchBtns[index].setAttribute('aria-expanded', 'false')
    })
  }
})