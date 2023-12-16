import { linkNavFunction, setStyle, getElement } from "./utils.js";
let works = window.localStorage.getItem("works")

if(works === null) {
    const response = await fetch('http://localhost:5678/api/works')
    works = await response.json()
    window.localStorage.setItem("works", JSON.stringify(works))
}
else {
    works = JSON.parse(works)
}

function generateModalWorks(works, selectHtmlTag) {
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

generateModalWorks(works, ".gallery-modal")
generateModalWorks(works, ".gallery")
linkNavFunction()

// create filter content works  // create filter content works

let buttonFilter = document.createElement("button")
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

getFilter.forEach((element) => {
    buttonFilter = document.createElement("button")
    getElement(".filter-content").appendChild(buttonFilter)
    buttonFilter.innerText = element.name
    buttonFilter.id = element.id
})

getElement(".filter-content button", "All").forEach((buttonsClick) => {
    buttonsClick.addEventListener("click", (event) => {
        if(event.target.innerText === "Tous") {
            generateModalWorks(works, ".gallery")
        }
        else {
            const filterWorks = works.filter((index) => {return index.categoryId == event.target.id})
            generateModalWorks(filterWorks, ".gallery")
        }
    })
})
// create filter content works  / END / create filter content works


/// Mode Admin /// Mode Admin /// Mode Admin
let getInformation = window.localStorage.getItem("user-Sophie")
getInformation = JSON.parse(getInformation)
if (getInformation && getInformation.token) {
    getElement("Mode-Edition", "Id").style.display = "flex"
    getElement("#portfolio .filter-content").style.display = "none"
    getElement("ul .login").innerText= "logout"
    const test = `<div class="modifier-container">
                    <div>
                        <i class="fa-regular fa-pen-to-square"></i>      
                        <span>modifier</span>
                    </div>
                </div>`; //renommer test!! ///////////
    // -insertion de la div container dans section (#portfolio)
    getElement("portfolio", "Id").insertAdjacentHTML("afterbegin", test) //rename test
    // -insertion balsie H2 (baliseH2Portfolio) dans div
    getElement(".modifier-container").insertAdjacentElement("afterbegin", getElement("#portfolio h2"))
    setStyle(".modifier-container", {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "31px",
    margin: "51px"})
    setStyle("#portfolio h2", {
        marginBottom: "0px"})
    //Active Modal with logo/btn modifier
    getElement(".modifier-container div").addEventListener("click", () => {
        getElement("myModal", "Id").style.display= "flex"
    })
}

//desactive Modal
window.addEventListener("click", (event) => {
    if(event.target === getElement("myModal", "Id")) {
        getElement("myModal", "Id").style.display= "none"
    }
})

function deleteWorks() {
    getElement(".fa-trash-can", "All").forEach(async (index) => {
        index.addEventListener("click", async (event) => {
            const deleteWorks = await fetch(`http://localhost:5678/api/works/${event.target.parentElement.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getInformation.token}`
            }
            })
            if(deleteWorks.ok) {
                const newWorks = works.filter((element) => {
                    return element.id != event.target.parentElement.id
                })
                window.localStorage.setItem("works", JSON.stringify(newWorks))
                works = window.localStorage.getItem("works")
                works = JSON.parse(works)
                generateModalWorks(works, ".gallery")
                generateModalWorks(works, ".gallery-modal")
            }
        })
    })
}


// Create Form// Create Form// Create Form
function AddPictureFunction() {
    getElement(".windows-modal-content button").addEventListener("click", () => {
        const GenerateFormModal = `
        <i class="fa-solid fa-xmark"></i>
        <i class="fa-solid fa-arrow-left"></i>
        <h2>Ajout photo</h2>
        <form class="form-add-picture" enctype="multipart/form-data" method="post" action="#">
            <div class="select-picture-container">
                <img src="/assets/svg/picture-svgrepo-com 1.svg" alt="svg-White-Background">
                <input type="file" name="image" id="image" accept="image/png, image/jpeg">
                <label for="image">+ Ajouter photo</label>
                <p>jpg, png : 4mo max</p>
            </div>
            <label for="title">Titre</label>
            <input type="text" name="title" id="title">
            <label for="category">Catégorie</label>
            <select name="category" id="category">
                <option value="" selected></option>
                <option value="1">Objets</option>
                <option value="2">Appartements</option>
                <option value="3">Hotels & restaurants</option>
            </select>
            <button>Valider</button>
        </form>`
        getElement(".windows-modal-content").innerHTML= GenerateFormModal
        buttonArrowXmark()
        SendSubmitForm()
        selectNewPicture()
    })
}
// Create Form// END// END // Create Form// Create Form// END// END

//FormData//FormData//FormData//FormData//FormData//FormData//FormData

function SendSubmitForm() { //rename function
    getElement(".form-add-picture").addEventListener("submit",async (event) => {
        event.preventDefault()
        const dataForm = getElement(".form-add-picture")
        const formData = new FormData(dataForm)
        const inputPicture = getElement(".select-picture-container input")
        const selectPictureCategorie = getElement(".form-add-picture select").value
        const inputText = getElement(`.form-add-picture input[type="text"]`).value

        if(inputPicture.files.length === 0 || selectPictureCategorie === "" || inputText === "") {
            alert("erreur dans le formulaire")
        }
        else {
            setStyle(".form-add-picture button", {
                backgroundColor: "#1D6154",
            })
        }
        const sendForm = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${getInformation.token}`,
            }
        })
        const GetFormResponse = await sendForm.json() //
        if(sendForm.ok) {
            works.push(GetFormResponse)
            window.localStorage.setItem("works", JSON.stringify(works))
            works = window.localStorage.getItem("works")
            works = JSON.parse(works)
            generateModalWorks(works, ".gallery")
            generateModalWorks(works, ".gallery-modal")
        }
    })
}

function selectNewPicture() {
    getElement(".select-picture-container input").addEventListener("change", (event) => {
        if(event.target.files) {
            const EventInputPicture = event.target.files[0]
            const getPictureUrl = URL.createObjectURL(EventInputPicture)
            getElement(".select-picture-container img").src = getPictureUrl
            getElement(".select-picture-container img").classList.add("imgSelect")
            getElement(".select-picture-container label").classList.add("label-Select-Img")
            getElement(".select-picture-container p").classList.add("text-Select-Img")
        }
    })
}

function buttonArrowXmark() {
    getElement(".windows-modal-content .fa-solid", "All").forEach((element) =>{
        element.addEventListener("click", (event) => {
            if(event.target.className === "fa-solid fa-xmark") {
                getElement("myModal", "Id").style.display = "none";
            }
            else if (event.target.className === "fa-solid fa-arrow-left") {
                generateModalWorks(works, ".gallery-modal")
            }
        })
    })
}

function generationWorks(test) {
    if(test === ".gallery") {
        getElement(".gallery").innerHTML = ""
    }
    else {
        const generationWorks = `
        <div class="windows-modal-content">
            <i class="fa-solid fa-xmark"></i>
            <h2>Galerie photo</h2>
            <div class="gallery-modal"></div>
            <button>Ajouter une photo</button>
        </div>`
    getElement("myModal", "Id").innerHTML= generationWorks
    AddPictureFunction()
    buttonArrowXmark()
    }
}