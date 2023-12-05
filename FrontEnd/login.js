
export function linkNavFunction () {
    document.querySelector(".login").addEventListener("click", () => {
        window.location.href =("login.html")
    })
    document.querySelector(".project").addEventListener("click", () => {
        window.location.href =("index.html")
    })
}

linkNavFunction ()

