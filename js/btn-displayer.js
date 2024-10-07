document.addEventListener("DOMContentLoaded", function() {
    "use strict";

let nav = document.querySelector("#nav");
let abrir = document.querySelector("#btn_menu");
let cerrar = document.querySelector("#cerrar_menu");


abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})

});