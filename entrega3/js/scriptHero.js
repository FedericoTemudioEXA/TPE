"use strict"

document.addEventListener("DOMContentLoaded", load);

function load(){


    /*header hero*/
    let header = document.querySelector("header");
    let hero_tamanio = document.querySelector(".hero").clientHeight;
    window.addEventListener("scroll", function(){
        if(this.window.scrollY>= hero_tamanio){
            header.classList.remove("header-hero");
        }else{
            header.classList.add("header-hero");
        }
    })

    /* flecha hero*/
    document.querySelector(".arrow-hero").addEventListener("click", () => {
        window.scroll({
            top: hero_tamanio,
            left: 0,
            behavior: 'smooth'
          });
    })
    

}