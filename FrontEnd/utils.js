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
                    window.localStorage.removeItem("user-Sophie")
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
        case "Id": 
        getElement = document.getElementById(selectorName)
            break
        case "All": 
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