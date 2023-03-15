let categories = []
let works = []
let worksBackup = []

// Cette fonction affiche les oeuvres en fonction de la catégorie sélectionnée
const displayWorks = category => {
  // On sélectionne l'élément HTML qui contiendra les oeuvres
  const portfolio = document.querySelector('.gallery')
  // On vide cet élément pour supprimer les oeuvres précédemment affichées
  portfolio.innerHTML = ''

  // On filtre les oeuvres à afficher en fonction de la catégorie sélectionnée
  const filteredWorks =
    category === 'Tous'
      ? worksBackup // Si 'Tous' est sélectionné, on affiche toutes les oeuvres
      : works.filter(work => work.category.name === category) // Sinon, on affiche seulement les oeuvres de la catégorie sélectionnée
  //s'applique a chaque éléments - Si la catégorie de l'élément actuel === à la catégorie choisie alors on l'ajoute

  // On ajoute chaque oeuvre au HTML
  filteredWorks.forEach(work => {
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    img.src = work.imageUrl
    img.alt = work.title
    figure.appendChild(img)
    const figcaption = document.createElement('figcaption')
    figcaption.textContent = work.title
    figure.appendChild(figcaption)
    portfolio.appendChild(figure)
  })
}

// Cette fonction affiche les boutons de sélection de catégorie
const filterCategories = () => {
  // On sélectionne l'élément HTML qui contiendra les boutons
  const divCategories = document.querySelector('.filter')

  // On ajoute un bouton "Tous" en premier (grâce à unshift qui ajoute l'élément et décale les autres éléments du tableau à droite)
  const all = { id: 0, name: 'Tous' }
  categories.unshift(all)

  // On crée un bouton pour chaque catégorie
  categories.forEach(category => {
    const buttonCategories = document.createElement('button')
    buttonCategories.innerText = category.name
    buttonCategories.classList.add('button-style')

    // On ajoute la classe "active" au bouton "Tous" (id: 0 étant "Tous")
    if (category.id === 0) {
      buttonCategories.classList.add('active')
    }

    // On ajoute chaque bouton au HTML
    divCategories.appendChild(buttonCategories)

    // On ajoute un événement "click" à chaque bouton
    buttonCategories.addEventListener('click', () => {
      // On filtre les oeuvres à afficher en fonction de la catégorie sélectionnée
      works =
        category.id === 0
          ? [...worksBackup] // Si 'Tous' est sélectionné, on affiche toutes les oeuvres
          : worksBackup.filter(work => work.categoryId === category.id) // Sinon, on affiche seulement les oeuvres de la catégorie sélectionnée

      // On supprime la classe "active" du bouton actuellement sélectionné
      const activeButton = document.querySelector('.active')
      if (activeButton) {
        activeButton.classList.remove('active')
      }

      // On ajoute la classe "active" au bouton sélectionné
      buttonCategories.classList.add('active')

      // On affiche les oeuvres correspondant à la catégorie sélectionnée
      displayWorks(category.name)
    })
  })
}

// Cette fonction récupère les données des catégories et des oeuvres depuis une API
const fetchData = async () => {
  try {
    // Récupération de deux réponses en parallèle en utilisant Promise.all
    const [categoriesResponse, worksResponse] = await Promise.all([
      fetch('http://localhost:5678/api/categories'),
      fetch('http://localhost:5678/api/works')
    ])

    // Si la réponse pour les catégories n'est pas réussie, une erreur est levée
    if (!categoriesResponse.ok) {
      throw new Error(
        `Failed to fetch categories: ${categoriesResponse.status}`
      )
    }
    // Si la réponse pour les œuvres n'est pas réussie, une erreur est levée
    if (!worksResponse.ok) {
      throw new Error(`Failed to fetch works: ${worksResponse.status}`)
    }

    // Les données JSON sont extraites de la réponse
    categories = await categoriesResponse.json()
    works = await worksResponse.json()
    // Une copie de la liste originale des œuvres est créée pour être utilisée plus tard lors de la filtration (Grâce à l'opérateur Spread on étale les éléments du tableau 'works' dans un tableau 'worksBackup')
    worksBackup = [...works]

    // La fonction filterCategories est appelée pour afficher les boutons de filtre dans la page
    filterCategories()
    console.log(categories)
    console.log(works)
    // La fonction displayWorks est appelée avec la catégorie "Tous" pour afficher toutes les œuvres initialement
    displayWorks('Tous')
  } catch (e) {
    console.error(e)
  }
}

// La fonction fetchData est appelée pour récupérer les données au démarrage de l'application
fetchData()
