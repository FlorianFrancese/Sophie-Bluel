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

// ************************************************************
// Modales
// ************************************************************

let modal = null
const focusableSelector = "button, a, input, textarea, select";
let focusables = [];
let previouslyFocusedElement = null;

const openModal = function (event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    focusables[0].focus();
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

const closeModal = function (event) {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    event.preventDefault();
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal', 'true');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    const hideModal= function () {
        modal.style.display = 'none'
        modal.removeEventListener('animationend', hideModal);
        modal = null;
    }
    modal.addEventListener('animationend', hideModal);
}

const stopPropagation = function (event) {
    event.stopPropagation();
}


const focusInModal = function (event) {
    event.preventDefault();
    let index = focusables.findIndex (f => f === modal.querySelector(':focus'));
    if (event.shiftKey === true) {
        index--
    } else {
        index++;
    };
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', (openModal));
});   

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closeModal(event);
    }
    if (event.key === 'Tab' && modal !== null) {
        focusInModal(event);
    }
})

const worksModal = document.querySelector('.modal-works');
for (let workModal = 0; workModal < returnWorks.length; workModal++) { 
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = returnWorks[workModal].imageUrl;
    img.alt = returnWorks[workModal].title;
    figure.appendChild(img);
    worksModal.appendChild(figure);
}

const categorieModal = document.querySelector('select#category');
if (categorieModal) {
    for (let modalcategorie = 0; modalcategorie < returnCategories.length; modalcategorie++) {
        const modalcategories = document.createElement('option');
        modalcategories.textContent = returnCategories[modalcategorie].name;
        modalcategories.value = returnCategories[modalcategorie].id;
        categorieModal.appendChild(modalcategories);
    }
}

const showAddPhotoButton = document.querySelector('#show-add-photo');
if (showAddPhotoButton) {
    showAddPhotoButton.addEventListener('click', function() {
        const gallerySection = document.querySelector('#gallery-section');
        const addPhotoSection = document.querySelector('#add-photo-section');
        if (gallerySection && addPhotoSection) {
            gallerySection.style.display = 'none';
            addPhotoSection.style.display = 'block';
        }
    });
}

const backToGalleryButton = document.querySelector('#back-to-gallery');
if (backToGalleryButton) {
    backToGalleryButton.addEventListener('click', function() {
        const gallerySection = document.querySelector('#gallery-section');
        const addPhotoSection = document.querySelector('#add-photo-section');
        if (gallerySection && addPhotoSection) {
            gallerySection.style.display = 'block';
            addPhotoSection.style.display = 'none';
        }
    });
}