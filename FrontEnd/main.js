import { linkNavFunction, setStyle, getElement, generationTags } from "./utils.js";
linkNavFunction() // Event listener (click) link Nav
let works = window.localStorage.getItem("works")

if(works === null) {
    works = await (await fetch('http://localhost:5678/api/works')).json()
    window.localStorage.setItem("works", JSON.stringify(works))
}
else {
    works = JSON.parse(works)
}

function generateGalleryWorks(works, selectHtmlTag) { //generation for gallery Main or gallery of modal
    generationWorks(selectHtmlTag) //function to add div gallery-modal
    works.forEach((element) => {
        const figureTag = document.createElement("figure")
        const imgGalery = document.createElement("img")
        getElement(selectHtmlTag).appendChild(figureTag)
        figureTag.appendChild(imgGalery)
        if(selectHtmlTag === ".gallery-modal") {
            const figcaptionTag = document.createElement("i")
            figureTag.appendChild(figcaptionTag)
            figcaptionTag.classList.add("fa-solid", "fa-trash-can")
            deleteWorks()
        }
        else {
            const figcaptionTag = document.createElement("figcaption")
            figureTag.appendChild(figcaptionTag)
            figcaptionTag.innerText = element.title
        }
        imgGalery.src = element.imageUrl
        figureTag.userId = element.userId
        figureTag.id = element.id
        figureTag.categoryId = element.categoryId
        figureTag.category = element.category
        imgGalery.alt = element.title
    })
}

generateGalleryWorks(works, ".gallery")

// create filter content works  // create filter content works // create filter content works

let buttonFilter = document.createElement("button") //create first btn & condition await/get by API
getElement(".filter-content").appendChild(buttonFilter)
buttonFilter.innerText = "Tous"
let getFilter = window.localStorage.getItem("categorie")
if(getFilter === null) {
    getFilter = await (await fetch("http://localhost:5678/api/categories")).json()
    window.localStorage.setItem("categorie", JSON.stringify(getFilter))
}
else {
    getFilter = JSON.parse(getFilter)
}

getFilter.forEach((element) => { // Create all buttons with iteration(name/id)
    buttonFilter = document.createElement("button")
    getElement(".filter-content").appendChild(buttonFilter)
    buttonFilter.innerText = element.name
    buttonFilter.id = element.id
})

getElement(".filter-content button", "all").forEach((buttonsClick) => { // Event on all buttons category for filter
    buttonsClick.addEventListener("click", (event) => {
        if(event.target.innerText === "Tous") {
            generateGalleryWorks(works, ".gallery")
        }
        else {
            const filterWorks = works.filter((index) => {return index.categoryId == event.target.id})
            generateGalleryWorks(filterWorks, ".gallery")
        }
    })
})
// create filter content works  // END // create filter content works // END / create filter content works


// Mode Admin /// Mode Admin /// Mode Admin // Mode Admin /// Mode Admin /// Mode Admin
let getInformation = JSON.parse(window.localStorage.getItem("userAdmin"))
if (getInformation && getInformation.token) {
    getElement("mode-edition", "id").style.display = "flex" //active div #mode-edition
    getElement("#portfolio .filter-content").style.display = "none" //filter main page disabled
    getElement("ul .login").innerText= "logout"
    const generateTags = `<div class="modifier-container">
                    <div>
                    <span><i class="fa-regular fa-pen-to-square"></i>      
                        modifier</span></div>
                </div>`;
    // -insertion div tag container in section (#portfolio)
    getElement("portfolio", "id").insertAdjacentHTML("afterbegin", generateTags) // add button modifier
    getElement(".modifier-container").insertAdjacentElement("afterbegin", getElement("#portfolio h2"))//insert h2 tag after div (modifier-container )
    getElement(".modifier-container").classList.add("modifier-container-activated")// add new class for CSS (flex, gap...)
    setStyle("#portfolio h2", {marginBottom: "0px"})
    generateGalleryWorks(works, ".gallery-modal")
}

//Active && desactive Modal (windows)
window.addEventListener("click", (event) => {
    if(event.target === getElement("myModal", "id")) {
        getElement("myModal", "id").style.display= "none"
    }
    else if(event.target === getElement(".modifier-container span") || event.target === getElement("#mode-edition p")) {
        getElement("myModal", "id").style.display= "flex"
    }
})

function deleteWorks() {
    getElement(".fa-trash-can", "all").forEach(async (index) => {
        index.addEventListener("click", async (event) => {
            const deleteWork = await fetch(`http://localhost:5678/api/works/${event.target.parentElement.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getInformation.token}`
            }
            })
            if(deleteWork.ok) {
                const newWorksFilter = works.filter((workDelete) => {
                    return workDelete.id != event.target.parentElement.id
                })
                window.localStorage.setItem("works", JSON.stringify(newWorksFilter))
                works = window.localStorage.getItem("works")
                works = JSON.parse(works)
                generateGalleryWorks(works, ".gallery")
                generateGalleryWorks(works, ".gallery-modal")
            }
        })
    })
}

// Create Form // Create Form // Create Form // Create Form // Create Form // Create Form
function addPictureFunction() {
    getElement(".windows-modal-content button").addEventListener("click", () => {
        generationTags("modalAddPicture") // Generate modal tags (main modal/ secondary)
        buttonArrowXmark() // To leave modal when click on arrow/Xmark
        conditionForm() // Condition form title/category
        selectNewPicture() //Condition when select picture
        sendSubmitForm() // Event listener (submit), POST by API work
    })
}
// Create Form// END// END // Create Form// Create Form// END// END

//FormData conditions //FormData conditions //FormData conditions //FormData conditions 
function conditionForm() { 
    getElement(".btn-form-picture").addEventListener("click", () => {
        const inputPicture = getElement("image", "id").files
        const inputTitle = getElement("title", "id").value
        const selectCategorieTag = getElement("category", "id").value
        try {
            if(!inputTitle.trim() && !selectCategorieTag) {
                    throw new Error("Les champs sont vides");
            }
            else if(!inputTitle.trim()) {
                throw new Error("Le champ du titre est vide");
            }
            else if(!selectCategorieTag.trim()) {
                throw new Error("Aucune catégorie sélectionnée");
            }
            else if(inputPicture.length  === 0) {
                throw new Error("Veuillez choisir une image");
            }
            else {
                getElement(".form-add-picture button").classList.remove("no-hover")
                getElement(".form-add-picture span").textContent = ""
            }
        }
        catch (error) {
            getElement(".form-add-picture button").classList.add("no-hover")
            getElement(".form-add-picture span").textContent = ""
            getElement(".form-add-picture span").textContent = `Erreur : ${error.message}` 
        }
    })
}

function selectNewPicture() {
    getElement(".select-picture-container input").addEventListener("change", (inputPicture) => {
        try {
            if (!['image/jpeg', 'image/png'].includes(inputPicture.target.files[0].type)) {
                throw new Error("Le format du ficher n'est pas valide, veuillez mettre un fichier jpeg/png");
            }
            else if(inputPicture.target.files[0].size > 4194304) {
                throw new Error("Taille du fichier au-dessus de 4mo");
            }
            else {
                getElement(".form-add-picture button").classList.remove("no-hover")
                getElement(".form-add-picture span").textContent = ""
                getElement(".select-picture-container img").src = URL.createObjectURL(inputPicture.target.files[0])
                getElement(".select-picture-container img").classList.add("img-select")
                getElement(".select-picture-container label").classList.add("label-select-img")
            }
        }
        catch (error) {
            getElement(".btn-form-picture").classList.add("no-hover")
            getElement("image", "id").value = ""
            getElement(".select-picture-container img").src = "/assets/svg/picture-svgrepo-com 1.svg"
            getElement(".select-picture-container img").classList.remove("img-select")
            getElement(".select-picture-container label").classList.remove("label-select-img")
            getElement(".form-add-picture span").textContent = `Erreur : ${error.message}` 
        }
    })
}

function sendSubmitForm() {
    getElement("category", "id").insertAdjacentElement("afterend", document.createElement("span"))
    getElement(".form-add-picture").addEventListener("submit",async (event) => {
        event.preventDefault()
        if(event.target.checkValidity()) {
            const formData = new FormData(getElement(".form-add-picture"))
            const sendForm = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {"Authorization": `Bearer ${getInformation.token}`}
            })
            const GetFormResponse = await sendForm.json()
            if(!sendForm.ok) {
                console.error("Echec de la requête vers l'API")
            }
            else if(sendForm.ok) {
                works.push(GetFormResponse)
                window.localStorage.setItem("works", JSON.stringify(works))
                works = window.localStorage.getItem("works")
                works = JSON.parse(works)
                generateGalleryWorks(works, ".gallery")
                generateGalleryWorks(works, ".gallery-modal")
            }
        }
    })
}
//FormData conditions END //FormData conditions // END FormData conditions // ENDFormData conditions // END FormData conditions

function generationWorks(gallerySelected) {
    if(gallerySelected === ".gallery") {
        getElement(".gallery").innerHTML = ""
    }
    else {
    generationTags("modalMain")
    addPictureFunction()
    buttonArrowXmark()
    }
}

export function buttonArrowXmark() {
    getElement(".windows-modal-content .fa-solid", "all").forEach((element) =>{
        element.addEventListener("click", (event) => {
            if(event.target.className === "fa-solid fa-xmark") {
                getElement("myModal", "id").style.display = "none";
            }
            else if (event.target.className === "fa-solid fa-arrow-left") {
                generateGalleryWorks(works, ".gallery-modal")
            }
        })
    })
}