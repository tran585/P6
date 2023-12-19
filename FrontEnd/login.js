import { linkNavFunction, getElement, setStyle } from "./utils.js";

function loginUsers() {
    const tagAlert = document.createElement("span")
    const tagForm = getElement("login-form", "id")
    tagForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const loginUser = {
            email: getElement("#login-form input[type=email]").value,
            password: getElement("#login-form input[type=password]").value
        }
        const chargeUtile = JSON.stringify(loginUser)
        const sendLoginUsers = await fetch("http://localhost:5678/api/users/login/", {
            method: "POST",
            body: chargeUtile,
            headers: {"Content-Type": "application/json"}
        })
        try {
            if (sendLoginUsers.ok) {
                window.localStorage.setItem("userAdmin", JSON.stringify(await sendLoginUsers.json()))
                window.location.href=("index.html")
            }
            else if (!sendLoginUsers.ok) {
                tagForm.appendChild(tagAlert)
                getElement("#login-form input[type=password]").insertAdjacentElement("afterend", tagAlert)
                setStyle("#login-form span", {
                    color: "red",
                    padding: "5px",
                })
                throw new Error("Les identifiants que vous avez saisis (e-mail ou mot de passe) ne sont pas reconnus. Veuillez réessayer.")
            }
        }
        catch (erreur) {
            tagAlert.innerText = erreur.message
            setTimeout(() =>{
                tagAlert.innerText = ""
            }, 6000)
        }
    })
}

loginUsers()
linkNavFunction()