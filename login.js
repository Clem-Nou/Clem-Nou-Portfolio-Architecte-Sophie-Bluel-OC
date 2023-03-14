const loginForm = document.getElementById('login')

loginForm.addEventListener('submit', async event => {
  event.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      const data = await response.json()
      const token = data.token

      localStorage.setItem('token', token)

      window.location.href = './index.html'
    } else {
      const error = await response.json()
      let alert = document.querySelector('form')
      let message = alert.querySelector('#toDelete')

      if (!message) {
        message = document.createElement('p')
        message.setAttribute('id', 'toDelete')
        let locationMessage = alert.firstChild
        alert.insertBefore(message, locationMessage)
      }

      message.style.color = 'red'
      message.innerText = 'Erreur: ' + error.message
    }
  } catch (error) {
    console.error(error)
    alert('Une erreur est survenue lors de la connexion')
  }
})
