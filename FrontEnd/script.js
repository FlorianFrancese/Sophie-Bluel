// ************************************************************
// Appel de l'API pour récupérer les catégories et les travaux
// Gestion des erreurs si l'API ne répond pas
// ************************************************************

let returnWorks;
let returnCategories;

try {
    const worksResponse = await fetch('http://localhost:5678/api/works');
    if (!worksResponse.ok) {
        throw new Error('Erreur lors de la récupération des travaux.');
    }
    returnWorks = await worksResponse.json();

    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    if (!categoriesResponse.ok) {
        throw new Error('Erreur lors de la récupération des catégories.');
    }
    returnCategories = await categoriesResponse.json();
} catch (error) {
    console.error('Une erreur s\'est produite :', error.message);
}

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
btnAll.classList.add('btn-filter__highlight');
btnAll.textContent = 'Tous';
btnAll.addEventListener('click', () => createGallery(returnWorks));
filters.appendChild(btnAll);

// Ajout des boutons pour chaque catégorie présente dans la base de données à l'aide d'une boucle
for (let categorie = 0; categorie < returnCategories.length; categorie++) {
    const btnFilters = document.createElement('button');
    btnFilters.classList.add('btn-filter');
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

const changeClassFilter = document.querySelectorAll('.filters button');
changeClassFilter.forEach(button => {
    button.addEventListener('click', () => {
        const removeHighlight = document.querySelector('.btn-filter__highlight');
        removeHighlight.classList.add('btn-filter');
        removeHighlight.classList.remove('btn-filter__highlight');
        button.classList.add('btn-filter__highlight');
    });
});


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
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    focusables[0].focus();
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

const closeModal = function (event) {
    event.preventDefault();
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
        gallerySection.style.display = 'flex';
        addPhotoSection.style.display = 'none';
        backToGalleryButton.style.display = 'none';
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
    const trash = document.createElement('button');
    trash.classList.add('trash');
    trash.type = 'button';
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can');
    trash.appendChild(trashIcon);
    figure.appendChild(trash);
    figure.appendChild(img);
    worksModal.appendChild(figure);
    trash.addEventListener('click', async function (event) {
        event.preventDefault();
        await fetch('http://localhost:5678/api/works/' + returnWorks[workModal].id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        figure.remove();
    });
}

const categorieModal = document.querySelector('.add-photo-section select');
for (let modalcategorie = 0; modalcategorie < returnCategories.length; modalcategorie++) {
    const modalcategories = document.createElement('option');
    modalcategories.textContent = returnCategories[modalcategorie].name;
    modalcategories.value = returnCategories[modalcategorie].id;
    categorieModal.appendChild(modalcategories);
}

const showAddPhotoButton = document.querySelector('.show-add-photo');
if (showAddPhotoButton) {
    showAddPhotoButton.addEventListener('click', function () {
        const gallerySection = document.querySelector('.gallery-section');
        const addPhotoSection = document.querySelector('.add-photo-section');
        if (gallerySection && addPhotoSection) {
            gallerySection.style.display = 'none';
            addPhotoSection.style.display = 'flex';
            backToGalleryButton.style.display = 'flex';
        }
    });
}

const backToGalleryButton = document.querySelector('.back-to-gallery');
const gallerySection = document.querySelector('.gallery-section');
const addPhotoSection = document.querySelector('.add-photo-section');
if (backToGalleryButton) {
    backToGalleryButton.addEventListener('click', function() {
        if (gallerySection && addPhotoSection) {
            gallerySection.style.display = 'flex';
            addPhotoSection.style.display = 'none';
            backToGalleryButton.style.display = 'none';
        }
    });
}

const addPhotoBtn = document.querySelector('.add-photo-btn');
const fileInput = document.querySelector('.btn-input');
addPhotoBtn.addEventListener('click', function() {
    fileInput.click();
});

const sendWorkBtn = document.querySelector('.send-work');
sendWorkBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    let image = document.querySelector('.btn-input').files[0];
    let title = document.querySelector('input[name="title"]').value;
    let category = document.querySelector('select[name="category"]').value;
    let formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('category', category);
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    });
    if (response.ok) {
        const success = document.querySelector('.add-photo-section');
        success.innerHTML ='';
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Votre photo a bien été envoyée';
        success.appendChild(successMessage);
        const successButton = document.createElement('button');
        successButton.type = 'button';
        successButton.classList.add('modal-btn', 'btn-success');
        successButton.textContent = 'OK';
        success.appendChild(successButton);
        successButton.addEventListener('click', function() {
            gallerySection.style.display = 'flex';
            addPhotoSection.style.display = 'none';
            backToGalleryButton.style.display = 'none';
            createGallery(returnWorks);
        });
    }
});

let miniature = document.querySelector('.add-miniature');
let addImage = document.querySelector('.add-picture');
fileInput.addEventListener('change', function() {
    let image = fileInput.files[0];
    if (image) {
        addImage.style.display = 'none';
        miniature.style.display = 'flex';
        let img = document.createElement('img');
        let reader = new FileReader();
        reader.onload = function(event) {
            img.src = event.target.result;
            miniature.innerHTML = '';
            miniature.appendChild(img);
            img.addEventListener('click', function() {
                fileInput.click();
            });
        };
        reader.readAsDataURL(image);
    }
});

let titleInput = document.querySelector('input[name="title"]');
let categorySelect = document.querySelector('select[name="category"]');
function checkFields() {
    let image = fileInput.files[0];
    let title = titleInput.value;
    let category = categorySelect.value;

    if (image && title && category) {
        sendWorkBtn.classList.remove('disable');
    } else {
        sendWorkBtn.classList.add('disable');
    }
}

fileInput.addEventListener('change', checkFields);
titleInput.addEventListener('input', checkFields);
categorySelect.addEventListener('change', checkFields);