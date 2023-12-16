import { linkNavFunction, getElement } from "./utils.js";

function loginUsers() {
    const tagAlert = document.createElement("p")
    const tagForm = getElement("modifyWorksForm", "Id")
    tagForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const loginUser = {
            email: getElement("#modifyWorksForm input[type=email]").value,
            password: getElement("#modifyWorksForm input[type=password]").value
        }
        const chargeUtile = JSON.stringify(loginUser)
        const sendLoginUsers = await fetch("http://localhost:5678/api/users/login/", {
            method: "POST",
            body: chargeUtile,
            headers: {"Content-Type": "application/json"}
        })
        if (sendLoginUsers.ok) {
            window.localStorage.setItem("user-Sophie", JSON.stringify(await sendLoginUsers.json()))
            window.location.href=("index.html")
        }
        else {
            tagForm.appendChild(tagAlert)
            tagAlert.innerText = "Votre adresse e-mail ou mot de passe est incorrect"
            alert("Votre adresse e-mail ou mot de passe est incorrect")
        }
    })
}
loginUsers()
linkNavFunction()