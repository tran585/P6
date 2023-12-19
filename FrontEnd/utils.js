// Event listener (click) link Nav
export function linkNavFunction() { 
    const liTag = document.querySelectorAll("header ul li")
    liTag.forEach((liTagIteration) => {
        liTagIteration.addEventListener("click", (event) => {
            switch (event.target.innerText) {
                case "login":
                    window.location.href = ("login.html")
                        break
                case "logout":
                    window.location.href = ("index.html")
                    window.localStorage.removeItem("userAdmin")
                        break
                case "projets":
                    window.location.href = ("index.html#portfolio")
                        break
                case "contact":
                    window.location.href= ("index.html#contact")
            }
        })
    })
}

linkNavFunction()

export function getElement(selectorName, type) { //Get
    let getElement = document.querySelector(selectorName)
    switch (type) {
        case "id": 
        getElement = document.getElementById(selectorName)
            break
        case "all": 
        getElement = document.querySelectorAll(selectorName)
    }
    return getElement 
}

export function setStyle(selector, styles) {
    const element = document.querySelector(selector);
    if (element) {
      Object.assign(element.style, styles);
    }
}

export function generationTags(tagsChoice) {
    if(tagsChoice === "modalMain") {
        const generationWorks = `
        <div class="windows-modal-content">
            <i class="fa-solid fa-xmark"></i>
            <h2>Galerie photo</h2>
            <div class="gallery-modal"></div>
            <button>Ajouter une photo</button>
        </div>`
    getElement("myModal", "id").innerHTML= generationWorks
    }
    else if(tagsChoice === "modalAddPicture") {
        const generateFormModal = `
        <i class="fa-solid fa-xmark"></i>
        <i class="fa-solid fa-arrow-left"></i>
        <h2>Ajout photo</h2>
        <form class="form-add-picture" enctype="multipart/form-data" method="post" action="#" novalidate>
            <div class="select-picture-container">
                <img src="/assets/svg/picture-svgrepo-com 1.svg" alt="svg-White-Background">
                <input type="file" name="image" id="image" accept="image/png, image/jpeg" required>
                <label for="image">+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="title">Titre</label>
            <input type="text" name="title" id="title" required>
            <label for="category">Catégorie</label>
            <select name="category" id="category" required>
                <option value="" selected></option>
                <option value="1">Objets</option>
                <option value="2">Appartements</option>
                <option value="3">Hotels & restaurants</option>
            </select>
            <button class="btn-form-picture no-hover">Valider</button>
        </form>`
        getElement(".windows-modal-content").innerHTML= generateFormModal
}
}

