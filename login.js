// On récupère le formulaire de login dans le DOM
const loginForm = document.getElementById('login')

// On ajoute un listener pour écouter l'événement "submit" sur le formulaire
loginForm.addEventListener('submit', async event => {
  // On empêche le formulaire de se soumettre normalement
  event.preventDefault()

  // On récupère les valeurs des champs "email" et "password"
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    // On envoie une requête HTTP POST au serveur pour se connecter
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })

    // Si la requête a réussi (code 2xx)
    if (response.ok) {
      // On récupère le token d'authentification depuis la réponse du serveur
      const data = await response.json()
      const token = data.token

      // On enregistre le token dans le local storage du navigateur
      localStorage.setItem('token', token)

      // On redirige l'utilisateur vers la page d'accueil
      window.location.href = './index.html'
    } else {
      // Si la requête a échoué, on affiche un message d'erreur
      const error = await response.json()
      let alert = document.querySelector('form')
      let message = alert.querySelector('#toDelete')

      // On crée un élément "p" pour afficher le message d'erreur, s'il n'existe pas déjà
      if (!message) {
        message = document.createElement('p')
        message.setAttribute('id', 'toDelete')
        let locationMessage = alert.firstChild
        alert.insertBefore(message, locationMessage)
      }

      // On change la couleur du message en rouge
      message.style.color = 'red'

      // Si le code de la réponse est 401, on affiche un message d'erreur spécifique
      if (response.status === 401) {
        message.innerText = 'Erreur: E-mail ou Mot de passe invalide'
      } else {
        // Sinon, on affiche le message d'erreur renvoyé par le serveur
        message.innerText = 'Erreur: ' + error.message
      }
    }
  } catch (error) {
    // Si une erreur se produit lors de la requête, on affiche un message d'erreur
    console.error(error)
    alert('Une erreur est survenue lors de la connexion')
  }
})
