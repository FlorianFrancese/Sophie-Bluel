// ************************************************************
// Appel de l'API pour récupérer les catégories et les travaux
// ************************************************************

// Récupération des travaux et des catégories depuis l'API + conversion en JSON
const works = await fetch('http://localhost:5678/api/works');
const returnWorks = await works.json();
const categories = await fetch('http://localhost:5678/api/categories');
const returnCategories = await categories.json();

// ************************************************************
// Affichage des travaux
// ************************************************************

// Fonction pour créer et afficher la galerie. Sélection de la classe 'gallery' dans le HTML puis suppression de son contenu.
// Boucle à travers chaque travail pour créer un élément 'figure' contenant une image et une légende.
function createGallery(returnWorks) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    for (let work = 0; work < returnWorks.length; work++) { 
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = returnWorks[work].imageUrl;
        img.alt = returnWorks[work].title;
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = returnWorks[work].title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// Appel de la fonction pour afficher tous les travaux
createGallery(returnWorks); 

// ************************************************************
// Affichage des filtres
// ************************************************************

// Ajout des buttons pour les filtres
const filters = document.querySelector('.filters');

// Ajout du bouton "Tous" en premier et écoute de l'événement click pour afficher tous les travaux
const btnAll = document.createElement('button');
btnAll.textContent = 'Tous';
btnAll.addEventListener('click', () => createGallery(returnWorks));
filters.appendChild(btnAll);

// Ajout des boutons pour chaque catégorie présente dans la base de données à l'aide d'une boucle
for (let categorie = 0; categorie < returnCategories.length; categorie++) {
    const btnFilters = document.createElement('button');
    btnFilters.textContent = returnCategories[categorie].name;
    filters.appendChild(btnFilters);

    // Ecoute de l'événement click pour afficher les travaux correspondant à la catégorie à l'aide d'une boucle
    // Création d'un tableau vide pour stocker les travaux filtrés
    btnFilters.addEventListener('click', () => {
        const filteredWorks = [];
        for (let filteredWork = 0; filteredWork < returnWorks.length; filteredWork++) {
            if (returnWorks[filteredWork].categoryId === returnCategories[categorie].id) {
                filteredWorks.push(returnWorks[filteredWork]);
            }
        }
        createGallery(filteredWorks);
    });
}

// ************************************************************
// Récupération du token
// ************************************************************

let token = localStorage.getItem('token');

// ************************************************************
// Afficahge des informations si l'utilisateur est connecté
// ************************************************************

if (token !== "undefined" && token !== null) {
    const bar = document.querySelector('.bar');
    const edit = document.querySelector('.edit');
    const login = document.querySelector('.login');
    const logout = document.querySelector('.logout');
    const header = document.querySelector('header');
    bar.style.display = 'flex';
    edit.style.display = 'flex';
    login.style.display = 'none';
    logout.style.display = 'block';
    header.style.margin = '0';
}

// ************************************************************
//Gestion du logout
// ************************************************************

const logout = document.querySelector('.logout');
logout.addEventListener('click', () => {
    localStorage.removeItem('token');
});