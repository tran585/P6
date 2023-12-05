import { linkNavFunction } from "/login.js";

const reponse = await fetch('http://localhost:5678/api/works')
const travaux = await reponse.json()

linkNavFunction ()


function genererTravaux(travaux) {

    travaux.forEach((element) => {

        const baliseParent = document.querySelector(".gallery")
        const balisesFigure = document.createElement("figure")
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
        balisesFigure.category = element.category
        balisesFigcaption.innerText = element.title
    })
}

genererTravaux(travaux)



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