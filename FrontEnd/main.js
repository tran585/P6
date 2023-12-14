let travaux = window.localStorage.getItem("travaux")

if(travaux === null) {
    const reponse = await fetch('http://localhost:5678/api/works')
    travaux = await reponse.json()
    window.localStorage.setItem("travaux", JSON.stringify(travaux))
}
else {
    travaux = JSON.parse(travaux)
}

function genererTravaux(travaux) {
    travaux.forEach((element) => {

        const baliseParent = document.querySelector(".gallery")
        const balisesFigure = document.createElement("figure") // refaire syntaxe (innerHTML) + setstyle
        const imgGalery = document.createElement("img")
        const balisesFigcaption = document.createElement("figcaption")
        baliseParent.appendChild(balisesFigure)
        balisesFigure.appendChild(imgGalery)
        balisesFigure.appendChild(balisesFigcaption)
        
        imgGalery.src = element.imageUrl
        balisesFigure.userId = element.userId
        balisesFigure.id = element.id
        balisesFigure.categoryId = element.categoryId
        imgGalery.alt = element.title
        balisesFigcaption.innerText = element.title
    })
}

genererTravaux(travaux)

function genererTravauxModal(travaux) {
    generationWorks()
    travaux.forEach((element) => {

        const baliseParent = document.querySelector(".gallery-Modal")
        const balisesFigure = document.createElement("figure") // refaire syntaxe (innerHTML) + setstyle
        const imgGalery = document.createElement("img")
        const balisesFigcaption = document.createElement("i")
        baliseParent.appendChild(balisesFigure)
        balisesFigure.appendChild(imgGalery)
        balisesFigure.appendChild(balisesFigcaption)

        
        imgGalery.src = element.imageUrl
        balisesFigure.userId = element.userId
        balisesFigure.id = element.id
        balisesFigure.categoryId = element.categoryId
        imgGalery.alt = element.title
        balisesFigcaption.classList.add("fa-solid", "fa-trash-can")
    })
    AddPictureFunction()
    recup()// renomage
}
genererTravauxModal(travaux)


function createButtonsFilter() {
    let buttonFilter = document.createElement("button")
    document.querySelector(".filter-content").appendChild(buttonFilter)
    buttonFilter.innerText = "Tous"
    const nameCategoryFilter = travaux.map(travaux => travaux.category.name).filter((value, index, self) => { return self.indexOf(value) === index})
    for(let i = 0; i < nameCategoryFilter.length; i++) {
        const idCategoryFilter = travaux.map(travaux => travaux.category.id).filter((value, index, self) => { return self.indexOf(value) === index})
        buttonFilter = document.createElement("button")
        document.querySelector(".filter-content").appendChild(buttonFilter)
        buttonFilter.innerText = nameCategoryFilter[i]
        buttonFilter.id = idCategoryFilter[i]
    }
}
createButtonsFilter()

function filterCategory() {
    document.querySelectorAll(".filter-content button").forEach((buttonsClick) => {
        buttonsClick.addEventListener("click", (event) => {
            document.querySelector(".gallery").innerHTML= ""
            if(event.target.innerText === "Tous") {
                genererTravaux(travaux)
            }
            else {
                const filterTravaux = travaux.filter((index) => {return index.categoryId == event.target.id})
                genererTravaux(filterTravaux)
            }
        })
    })
}

filterCategory()


/// Mode Admin /// Mode Admin /// Mode Admin
let getInformation = window.localStorage.getItem("user-Sophie")
getInformation = JSON.parse(getInformation)
if(getInformation.token) {
    document.getElementById("Mode-Edition").style.display = "flex" //mettre setStyle function
    GetElement("#portfolio .filter-content").style.display = "none" //idem
    GetElement("ul .login").innerText= "logout" //idem
    const test = `<div class="modifier-Container">
                    <div>
                        <i class="fa-regular fa-pen-to-square"></i>      
                        <span>modifier</span>
                    </div>
                </div>`; //renommer test!! ///////////
    // -insertion de la div container dans section (#portfolio)
    document.getElementById("portfolio").insertAdjacentHTML("afterbegin", test) //rename test
    // -insertion balsie H2 (baliseH2Portfolio) dans div
    GetElement(".modifier-Container").insertAdjacentElement("afterbegin", document.querySelector("#portfolio h2"))
    setStyle(".modifier-Container", { 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "31px",
    margin: "51px"})
    setStyle("#portfolio h2", {
        marginBottom: "0px"})
}

//For logout user click 
GetElement("ul .login").addEventListener("click", (event) => {
    if(event.target.innerText === "logout") {
        window.location.href =("index.html")
        window.localStorage.removeItem("user-Sophie")
    }
})

//Active Modal with logo/btn modifier
GetElement(".modifier-Container div").addEventListener("click", () => {
    GetElement("myModal", "Id").style.display= "flex"
})



//desactive Modal 
window.addEventListener("click", (event) => {
    if(event.target === document.getElementById("myModal")) {
        GetElement("myModal", "Id").style.display= "none"
    }
})

function recup() {
    GetElement(".fa-trash-can", "All").forEach(async (index) => {
        index.addEventListener("click", async (event) => {

            const deleteTravaux = await fetch(`http://localhost:5678/api/works/${event.target.parentElement.id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getInformation.token}`
            }
            })
            if(deleteTravaux.ok) {
                const newTravaux = travaux.filter((element) => {
                    return element.id != event.target.parentElement.id
                })
                GetElement(".gallery").innerHTML = ""
                GetElement(".gallery-Modal").innerHTML = ""
                window.localStorage.setItem("travaux", JSON.stringify(newTravaux))
                travaux = window.localStorage.getItem("travaux")
                travaux = JSON.parse(travaux)
                genererTravaux(travaux)
                genererTravauxModal(travaux)
            }
        })
    })
}

// Create Form// Create Form// Create Form
function AddPictureFunction() {
    GetElement(".windows-Modal-Content button").addEventListener("click", (event) => {
        const GenerateFormModal = `
        <i class="fa-solid fa-xmark"></i>
        <i class="fa-solid fa-arrow-left"></i>
        <h2>Ajout photo</h2>
        <form class="form-Add-Picture" enctype="multipart/form-data" method="post" action="#">
            <div class="select-Picture-Container">
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
        GetElement(".windows-Modal-Content").innerHTML= GenerateFormModal
        selectNewPicture()
        cancelSubmitForm()
        buttonArrowXmark()
    })
}
// Create Form// END// END // Create Form// Create Form// END// END


//FormData//FormData//FormData//FormData//FormData//FormData//FormData

function cancelSubmitForm() {
    GetElement(".form-Add-Picture").addEventListener("submit",async (event) => {
        event.preventDefault()
        const dataForm = GetElement(".form-Add-Picture")
        const formData = new FormData(dataForm)
        const inputPicture = GetElement(".select-Picture-Container input")
        const selectPictureCategorie = GetElement(".form-Add-Picture select").value
        const inputText = GetElement(`.form-Add-Picture input[type="text"]`).value

        if(inputPicture.files.length === 0 || selectPictureCategorie === "" || inputText === "") {
            alert("erreur dans le formulaire")
        }
        else {
            setStyle(".form-Add-Picture button", {
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
        const GetFormReponse = await sendForm.json()
        console.log(GetFormReponse)
        if(sendForm.ok) {
            travaux.push(GetFormReponse)
            GetElement(".gallery").innerHTML = ""
            genererTravaux(travaux)
            genererTravauxModal(travaux)
        }
    })
}


console.log(travaux)



//Fonction//Fonction//Fonction//Fonction//Fonction//Fonction//Fonction

function selectNewPicture() {
    GetElement(".select-Picture-Container input").addEventListener("change", (event) => {
        if(event.target.files) {
            const EventInputPicture = event.target.files[0]
            const getPictureUrl = URL.createObjectURL(EventInputPicture)
            GetElement(".select-Picture-Container img").src = getPictureUrl
            GetElement(".select-Picture-Container img").classList.add("imgSelect")
            GetElement(".select-Picture-Container label").classList.add("label-Select-Img")
            GetElement(".select-Picture-Container p").classList.add("text-Select-Img")
        }
    })
}



function buttonArrowXmark() {
    GetElement(".windows-Modal-Content .fa-solid", "All").forEach((element) =>{
        element.addEventListener("click", (event) => {
            if(event.target.className === "fa-solid fa-xmark") {
                GetElement("myModal", "Id").style.display = "none";
            }
            else if (event.target.className === "fa-solid fa-arrow-left") {
            genererTravauxModal(travaux)
            buttonArrowXmark()
            AddPictureFunction()
            }
        })
    })
}

function generationWorks() {
    const generationWorks = `
    <div class="windows-Modal-Content">
        <i class="fa-solid fa-xmark"></i>
        <h2>Galerie photo</h2>
        <div class="gallery-Modal"></div>
        <button>Ajouter une photo</button>
    </div>`
GetElement("myModal", "Id").innerHTML= generationWorks
buttonArrowXmark()
}

function GetElement(selectorName, type) { //Get
    let GetElement = document.querySelector(selectorName)
    switch (type) {
        case "Id": 
        GetElement = document.getElementById(selectorName)
            break
        case "All": 
        GetElement = document.querySelectorAll(selectorName)
    }
    return GetElement 
}

function setStyle(selector, styles) {
    const element = document.querySelector(selector);
    if (element) {
      Object.assign(element.style, styles);
    }
}