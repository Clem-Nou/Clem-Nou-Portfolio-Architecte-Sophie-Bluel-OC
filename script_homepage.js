async function getWorks() {
  try {
    /*Récupérer les projets */
    const responseWork = await fetch('http://localhost:5678/api/works', {})
    if (!responseWork.ok) {
      throw new Error(`Failed to fetch: ${responseWork.status}`)
    }
    const displayWork = await responseWork.json()
    let portfolio = document.querySelector('.gallery')
    /*Supprimer le HTML*/
    portfolio.innerHTML = ''
    for (let i in displayWork) {
      /*Intégrer les projets récupérés via l'API*/
      let figure = document.createElement('figure')

      let img = document.createElement('img')
      img.setAttribute('src', displayWork[i].imageUrl)
      img.setAttribute('alt', displayWork[i].title)
      figure.appendChild(img)

      let figcaption = document.createElement('figcaption')
      figcaption.textContent = displayWork[i].title
      figure.appendChild(figcaption)

      console.log(portfolio)
      portfolio.appendChild(figure)
    }
  } catch (e) {
    console.log(e)
  }
}
getWorks()

async function getCategories() {
  try {
    /*Création des filtres */
    const responseCategories = await fetch(
      'http://localhost:5678/api/categories'
    )
    if (!responseCategories.ok) {
      throw new Error(`Failed to fetch: ${responseCategories.status}`)
    }
    const displayCategories = await responseCategories.json()

    /*Choix de l'emplacement de la balise HTML*/
    const divCategories = document.querySelector('.filter')
    const all = {
      id: 0,
      name: 'Tous'
    }
    displayCategories.unshift(all)

    /*Boucle dans le tableau json*/
    for (let i in displayCategories) {
      /*Création des balises HTML*/
      const buttonCategories = document.createElement('button')
      buttonCategories.innerText = displayCategories[i].name
      /*Ajoute une class*/
      buttonCategories.classList.add('choice-pictures')
      if (displayCategories[i].id === 0)
        buttonCategories.classList.add('active')
      /*Placement*/
      divCategories.appendChild(buttonCategories)
      /*Filtres sur les boutons*/
      buttonCategories.addEventListener('click', function () {
        let worksFilters = responseWork
        if (displayCategories[i].id != 0) {
          worksFilters = responseWork.filter(function (responseWork) {
            return responseWork.categoryId === displayCategories[i].id
          })
        }
        document.querySelector('.active').classList.remove('active')
        buttonCategories.classList.add('active')
      })
    }
    console.log(divCategories)
  } catch (e) {
    console.log(e)
  }
}
getCategories()
