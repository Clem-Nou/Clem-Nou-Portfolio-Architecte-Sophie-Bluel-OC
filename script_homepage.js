async function getWorks() {
  try {
    /*Récupérer les projets */
    const responseWork = await fetch('http://localhost:5678/api/works', {})

    if (!responseWork.ok) {
      throw new Error(`Failed to fetch: ${responseWork.status}`)
    }

    return responseWork.json().then(function (json) {
      console.log(json)
      let portfolio = document.querySelector('.gallery')
      /*Supprimer le HTML*/
      portfolio.innerHTML = ''
      for (let i in json) {
        /*Intégrer les projets récupérés via l'API*/
        let figure = document.createElement('figure')

        let img = document.createElement('img')
        img.setAttribute('src', json[i].imageUrl)
        img.setAttribute('alt', json[i].title)
        figure.appendChild(img)

        let figcaption = document.createElement('figcaption')
        figcaption.textContent = json[i].title
        figure.appendChild(figcaption)

        console.log(portfolio)
        portfolio.appendChild(figure)
      }
    })
  } catch (e) {
    console.log(e)
  }
}
console.log(getWorks())
