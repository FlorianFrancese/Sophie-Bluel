// ************************************************************
// Envoie de la requête de connexion à l'API en récupérant les données du formulaire
// Stockage du token dans le localStorage
// ************************************************************
const loginForm = document.querySelector('.login-form form');
async function loginRequest (loginForm) {
    let email = loginForm.querySelector('input[name="email"]').value;
    let password = loginForm.querySelector('input[name="password"]').value;
    let data = {
        email: email,
        password: password
    };
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    localStorage.setItem('token', json.token);
    return json.token;
}

function error () {
    const error = document.querySelector('.error');
    const pError = document.createElement('p');
    pError.textContent = "L'adresse e-mail ou le mot de passe que vous avez entré est incorrect.";
    error.style.display = 'block';
    error.appendChild(pError);

}

// ************************************************************
// Vérification du token et redirection vers la page d'accueil si connecté
// ************************************************************
function tokenVerify (token) {
    if (token === undefined || token === null) {
        error();
    }
        else {
            window.location.href = 'index.html';
        }
    }

// ************************************************************
// Ecoute de l'événement submit sur le formulaire de connexion
// Puis éxecution des fonctions loginRequest et tokenVerify
// ************************************************************
function login() {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = await loginRequest(loginForm);
        tokenVerify(token);
    });
}

// ************************************************************
// Appel de la fonction login
// ************************************************************
login();