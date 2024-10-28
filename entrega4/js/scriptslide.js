"use strict"

document.addEventListener("DOMContentLoaded", load);

function load(){
    const carruseles = [...document.querySelectorAll(".slide")];
    //console.log(carruseles);
    const nxtBtn = [...document.querySelectorAll(".button-right")];
    const preBtn = [...document.querySelectorAll(".button-left")];
    const NAV_CARRUSEL = [...document.querySelectorAll(".pag-slide")];

    carruseles.forEach((item,i)=> {
        let liSlide= [...item.querySelectorAll("ul.slide li")];
        let dimensionContenedor = item.getBoundingClientRect();
        let contenedorWidth = dimensionContenedor.width;
        //console.log(item.scrollWidth);
        //console.log(contenedorWidth);
        //console.log(item.scrollWidth/contenedorWidth)

        nxtBtn[i].addEventListener("click", () => {
            
            let activo = NAV_CARRUSEL[i].querySelector(".active");
       
        /*paginacion slide hacia adelante*/
            if(activo.nextSibling){
                item.scrollLeft += contenedorWidth;
                activo.nextSibling.classList.add("active");
                activo.classList.remove("active");
                //animacion slide
                liSlide.forEach(li => {
                    li.classList.add("moveRightLi");
                    setTimeout(()=> {
                        li.classList.remove("moveRightLi");
                    },2000)
                    
                    console.log(li)
                })
            }else{
                item.scrollLeft = 0;
                NAV_CARRUSEL[i].firstElementChild.classList.add("active");
                NAV_CARRUSEL[i].lastElementChild.classList.remove("active")
                liSlide.forEach(li => {
                    li.classList.add("moveLeftLi");
                    setTimeout(()=> {
                        li.classList.remove("moveLeftLi");
                    },2000)
                    
                    console.log(li)
                })
            }
        })
        /*paginacion slide hacia atras*/
        preBtn[i].addEventListener("click", () => {
            item.scrollLeft -= contenedorWidth;
            let activo = NAV_CARRUSEL[i].querySelector(".active");
            if(activo.previousSibling){
                activo.previousSibling.classList.add("active");
                activo.classList.remove("active");
                liSlide.forEach(li => {
                    li.classList.add("moveLeftLi");
                    setTimeout(()=> {
                        li.classList.remove("moveLeftLi");
                    },2000)
                    
                    console.log(li)
                })
            }else{
                item.scrollLeft = item.scrollWidth;
                NAV_CARRUSEL[i].lastElementChild.classList.add("active");
                NAV_CARRUSEL[i].firstElementChild.classList.remove("active") 
                liSlide.forEach(li => {
                    li.classList.add("moveRightLi");
                    setTimeout(()=> {
                        li.classList.remove("moveRightLi");
                    },2000)
                    
                    console.log(li)
                })
            }
        })

        /*generacion de circulos para la paginacion con su interaccion */
        let cantidad_nav=Math.trunc( item.scrollWidth/contenedorWidth);

        for(let j=-1; j < cantidad_nav; j++){
            let button = document.createElement("button");
            if(j===-1){
                button.classList.add("active")
            }
            NAV_CARRUSEL[i].appendChild(button);
            button.addEventListener("click",(e) => {
                if(item.scrollLeft>contenedorWidth * (j+1)){
                    liSlide.forEach(li => {
                        li.classList.add("moveLeftLi");
                        setTimeout(()=> {
                            li.classList.remove("moveLeftLi");
                        },2000)
                        
                        console.log(li)
                    })
                }else{
                    liSlide.forEach(li => {
                        li.classList.add("moveRightLi");
                        setTimeout(()=> {
                            li.classList.remove("moveRightLi");
                        },2000)
                        
                        console.log(li)
                    })
                }
                item.scrollLeft = contenedorWidth * (j+1);
                NAV_CARRUSEL[i].querySelector(".active").classList.remove("active");
                e.target.classList.add("active");
            }) 
        }
    }) 
}