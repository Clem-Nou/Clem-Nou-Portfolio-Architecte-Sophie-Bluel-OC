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

      // On supprime la classe "active"
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

// MODALE //

// Sélection des éléments du DOM
const openModalContainer = document.querySelector('#open-modal-container')
const openModalButton = document.querySelector('#open-modal')
const closeModalButton = document.querySelector('#close-modal')
const modalDialog = document.querySelector('#modal')
const modalGallery = document.getElementById('modal-gallery')

// Vérification de la présence d'un token d'authentification dans le local storage
if (localStorage.getItem('token')) {
  openModalContainer.style.display = 'block'
}

// Gestionnaire d'événements pour ouvrir la modale
openModalButton.addEventListener('click', () => {
  modalDialog.showModal()
  displayWorksInModal()
  document.body.classList.add('modal-open')
})

// Gestionnaire d'événements pour fermer la modale
closeModalButton.addEventListener('click', () => {
  modalDialog.close()
  document.body.classList.remove('modal-open')
})

// Ferme la modale si l'utilisateur clique en dehors de celle-ci
window.addEventListener('click', event => {
  if (event.target == modalDialog) {
    modalDialog.close()
    document.body.classList.remove('modal-open')
  }
})

// Fonction pour afficher les travaux dans la modale
function displayWorksInModal() {
  // Effacer le contenu précédent de la modale
  modalGallery.innerHTML = ''

  // Parcourir les travaux et créer une figure pour chacun
  works.forEach(work => {
    const modalFigure = document.createElement('figure')

    // Créer un conteneur pour l'icône de suppression et de positionnement
    const modalFigureContainer = document.createElement('div')
    modalFigureContainer.classList.add('modal-img-container')

    // Créer l'icône de suppression
    const modalDeleteIcon = document.createElement('i')
    modalDeleteIcon.classList.add('fa-regular', 'fa-trash-can')
    modalFigureContainer.appendChild(modalDeleteIcon)
    modalDeleteIcon.addEventListener('click', () => {
      const worksDel = work.id
      fetch(`http://localhost:5678/api/works/${worksDel}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            // Supprime le projet de la liste des projets
            const index = works.findIndex(w => w.id === work.id)
            if (index > -1) {
              works.splice(index, 1)
            }
            // Actualise la galerie de projets dans la modale
            displayWorksInModal()
          } else {
            throw new Error('Erreur lors de la suppression du projet')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
    // Créer l'image et l'ajouter au conteneur
    const modalImg = document.createElement('img')
    modalImg.src = work.imageUrl
    modalImg.alt = work.title
    modalImg.classList.add('modal-img')

    // Créer l'icône de positionnement et le cacher par défaut
    const modalPositionIcon = document.createElement('i')
    modalPositionIcon.classList.add(
      'fa-solid',
      'fa-arrows-up-down-left-right',
      'fa-position'
    )
    modalFigureContainer.appendChild(modalPositionIcon)

    // Ajouter les événements pour afficher/cacher l'icône de positionnement
    modalFigureContainer.addEventListener('mouseenter', () => {
      modalPositionIcon.classList.add('visible')
    })
    modalFigureContainer.addEventListener('mouseleave', () => {
      modalPositionIcon.classList.remove('visible')
    })

    modalFigureContainer.appendChild(modalImg)

    // Ajouter le conteneur d'icône et d'image à la figure
    modalFigure.appendChild(modalFigureContainer)

    // Ajouter le bouton d'édition à la figure
    const modalEdit = document.createElement('figcaption')
    modalEdit.innerText = 'éditer'
    modalEdit.classList.add('modal-fig')
    modalFigure.appendChild(modalEdit)

    // Ajouter la figure à la galerie modale
    modalGallery.appendChild(modalFigure)
  })
}

// Affiche les Edits sur la page Index si l'utilisateur est connecté //
// Vérifie si l'utilisateur est connecté
const isConnected = localStorage.getItem('token') !== null

// Récupère les éléments à modifier
const modifPortfolio = document.getElementById('modif-portfolio')
const modifPic = document.getElementById('modif-pic')

// Ajoute ou supprime la classe CSS "hidden" en fonction de l'état de connexion de l'utilisateur
if (isConnected) {
  modifPortfolio.classList.remove('hidden')
  modifPic.classList.remove('hidden')
} else {
  modifPortfolio.classList.add('hidden')
  modifPic.classList.add('hidden')
}
