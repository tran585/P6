
document.querySelector(".login").addEventListener("click", () => {
    window.location.href =("login.html")
})
document.querySelector(".project").addEventListener("click", () => {
    window.location.href =("index.html")
})



function loginUsers() {
    const form = document.querySelector("form") //Recréer balise Form
    const baliseAlert = document.createElement("p")
    const baliseForm = document.querySelector("form")// double balise?
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const loginUser = {
            email: document.querySelector("form input[type=email]").value,
            password: document.querySelector("form input[type=password]").value
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
            baliseForm.appendChild(baliseAlert)
            baliseAlert.innerText = "Votre adresse e-mail ou mot de passe est incorrect"
            alert("Votre adresse e-mail ou mot de passe est incorrect")
        }
    })
}

loginUsers()