let categories = []
let works = []
let worksBackup = []

// ----------------- GESTION DE LA PAGE D'ACCUEIL -----------------  //

// Cette fonction affiche les oeuvres en fonction de la catégorie sélectionnée
const displayWorks = category => {
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
  const divCategories = document.querySelector('.filter')

  // On ajoute un bouton "Tous" en premier (grâce à unshift qui ajoute l'élément et décale les autres éléments du tableau à droite)
  const all = { id: 0, name: 'Tous' }
  categories.unshift(all)

  // On crée un bouton pour chaque catégorie
  categories.forEach(category => {
    const categoryButton = document.createElement('button')
    categoryButton.innerText = category.name
    categoryButton.classList.add('button-style')

    // On ajoute la classe "active" au bouton "Tous" (id: 0 étant "Tous")
    if (category.id === 0) {
      categoryButton.classList.add('active')
    }

    divCategories.appendChild(categoryButton)

    categoryButton.addEventListener('click', () => {
      // On filtre les oeuvres à afficher en fonction de la catégorie sélectionnée
      works =
        category.id === 0
          ? [...worksBackup] // Si 'Tous' est sélectionné, on affiche toutes les oeuvres
          : worksBackup.filter(work => work.categoryId === category.id) // Sinon, on affiche seulement les oeuvres de la catégorie sélectionnée

      // On met la classe "active" au filtre sélectionné
      const activeButton = document.querySelector('.active')
      if (activeButton) {
        activeButton.classList.remove('active')
      }
      categoryButton.classList.add('active')
      displayWorks(category.name)
    })
  })
}

// Cette fonction récupère les données des catégories et des oeuvres depuis une API
const fetchData = async () => {
  try {
    const [categoriesResponse, worksResponse] = await Promise.all([
      fetch('http://localhost:5678/api/categories'),
      fetch('http://localhost:5678/api/works')
    ])

    // Si la réponsen'est pas réussie, une erreur est levée
    if (!categoriesResponse.ok) {
      throw new Error(
        `Failed to fetch categories: ${categoriesResponse.status}`
      )
    }
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
fetchData()

// ----------------- MODALE -----------------  //

// Sélection des éléments du DOM
const openModalContainer = document.querySelector('#open-modal-container')
const openModalButton = document.querySelector('#open-modal')
const closeAddModalButton = document.querySelector('#close-add-project-modal')
const deleteProjectModal = document.getElementById('delete-project-modal')
const addProjectModal = document.getElementById('add-project-modal')
const addProjectButton = document.querySelector('.addPictures')
const modalGallery = document.getElementById('modal-gallery')
const modifPortfolio = document.getElementById('modif-portfolio')
const modifPic = document.getElementById('modif-pic')
const filter = document.querySelector('.filter')

// Vérification de la connexion utilisateur
function loginLogout() {
  const token = localStorage.getItem('token')
  const logoutLink = document.getElementById('logoutLink')
  const loginLink = document.getElementById('loginLink')

  if (token) {
    logoutLink.style.display = 'block'
    loginLink.style.display = 'none'
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('token')
      window.location.reload()
    })
  } else {
    logoutLink.style.display = 'none'
    loginLink.style.display = 'block'
  }
}

// Gestionnaire d'événements pour ouvrir la modale
openModalButton.addEventListener('click', () => {
  deleteProjectModal.showModal()
  displayWorksInModal()
  document.body.classList.add('modal-open')
})

// Fonction pour fermer toutes les modales
function closeModals() {
  deleteProjectModal.close()
  addProjectModal.close()
  document.body.classList.remove('modal-open')
}

// Ferme la modale si l'utilisateur clique en dehors de celle-ci
function closeOnClickOutside(modal) {
  window.addEventListener('click', function (event) {
    if (event.target == modal || event.target == closeAddModalButton) {
      closeModals()
      document.body.classList.remove('modal-open')
    }
  })
}

// Vérification de la présence d'un token d'authentification dans le local storage
const isConnected = localStorage.getItem('token') !== null

if (isConnected) {
  openModalContainer.style.display = 'block'
  filter.style.display = 'none'
  showModifIcons()
  loginLogout()
} else {
  hideModifIcons()
}

// Fonction pour afficher les icônes d'édition des travaux
function showModifIcons() {
  modifPortfolio.classList.remove('hidden')
  modifPic.classList.remove('hidden')
}

// Fonction pour cacher les icônes d'édition des travaux
function hideModifIcons() {
  modifPortfolio.classList.add('hidden')
  modifPic.classList.add('hidden')
}

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
      // Affiche une boîte de dialogue de confirmation
      const confirmed = confirm(
        'Êtes-vous sûr(e) de vouloir supprimer cet élément ?'
      )
      if (confirmed) {
        // Effectue la suppression
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
              // Avertissement à l'utilisateur que l'élément a été supprimé
              alert("L'élément a été supprimé.")
              // Actualise la galerie de projets dans la modale
              displayWorksInModal()
            } else {
              throw new Error('Erreur lors de la suppression du projet')
            }
          })
          .catch(error => {
            console.error(error)
          })
      }
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
displayWorksInModal()
closeOnClickOutside(deleteProjectModal)

// Ajoute un événement au clic sur le bouton d'ajout de projet pour ouvrir la modale d'ajout
addProjectButton.addEventListener('click', () => {
  openAddProjectModal()
})

// Ferme la modale d'ajout de projet si l'utilisateur clique en dehors de la modale ou sur le bouton de fermeture
closeOnClickOutside(addProjectModal, closeAddModalButton)

const inputElement = document.getElementById('image')
const previewElement = document.getElementById('image-preview')
const addButtonElement = document.querySelector('.add-picture-button')
const addPicturePlaceholderElement = document.querySelector(
  '.add-picture-placeholder'
)

inputElement.addEventListener('change', e => {
  const file = e.target.files[0]

  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      previewElement.src = reader.result
      addPicturePlaceholderElement.style.display = 'none'
      previewElement.classList.remove('hidden')
    }
  } else {
    previewElement.src = ''
    addPicturePlaceholderElement.style.display = 'block'
    previewElement.classList.add('hidden')
  }
})

// Récupération des éléments du DOM
const addProjectForm = document.getElementById('add-project-form')
const addPictureButton = document.querySelector('.add-picture-button')
const imageInput = document.getElementById('image')
const imagePreview = document.getElementById('image-preview')
const pictureTitleInput = document.getElementById('title')
const categorySelection = document.getElementById('category-selection')

// Fonction pour afficher la modale d'ajout de projet
function openAddProjectModal() {
  // Vérifie si la modale est déjà ouverte
  if (!addProjectModal.hasAttribute('open')) {
    // Affichage de la modale
    addProjectModal.showModal()
    // Ajout des options de catégories à la liste déroulante
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(categories => {
        categories.forEach(category => {
          const option = document.createElement('option')
          option.value = category.id
          option.textContent = category.name
          categorySelection.appendChild(option)
        })
      })
  }
}

// Fonction pour fermer la modale d'ajout de projet
function closeAddProjectModal() {
  // Réinitialisation du formulaire
  addProjectForm.reset()
  imagePreview.classList.add('hidden')
  imagePreview.src = ''
  categorySelection.innerHTML = ''

  // Fermeture de la modale
  addProjectModal.close()
}

// Fonction pour prévisualiser l'image sélectionnée
function previewImage() {
  const file = imageInput.files[0]
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    imagePreview.src = reader.result
    imagePreview.classList.remove('hidden')
  })

  if (file) {
    reader.readAsDataURL(file)
  }
}

// Gestionnaire d'événement pour ouvrir la modale d'ajout de projet
document
  .querySelector('.addPictures')
  .addEventListener('click', openAddProjectModal)

// Gestionnaire d'événement pour fermer la modale d'ajout de projet
document
  .getElementById('close-add-project-modal')
  .addEventListener('click', closeAddProjectModal)

// Gestionnaire d'événement pour retourner à la modale de galerie
document.getElementById('return').addEventListener('click', () => {
  closeAddProjectModal()
})

// Gestionnaire d'événement pour prévisualiser l'image sélectionnée
imageInput.addEventListener('change', previewImage)

// Gestionnaire d'événement pour valider le formulaire d'ajout de projet
addProjectForm.addEventListener('submit', event => {
  event.preventDefault()

  // Envoi de la requête POST pour ajouter le projet
  const formData = new FormData(addProjectForm)

  fetch('http://localhost:5678/api/works/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },

    body: formData
  })
    .then(response => {
      if (response.ok) {
        // Fermeture de la modale et rechargement de la page pour afficher le nouveau projet
        closeAddProjectModal()
        location.reload()
      } else {
        throw new Error("Erreur lors de l'ajout du projet")
      }
    })
    .catch(error => {
      console.error(error)
      const errorMessage = document.getElementById('error-message')
      errorMessage.innerHTML =
        "Une erreur s'est produite. Veuillez vérifier les champs du formulaire et réessayer."
    })
})
