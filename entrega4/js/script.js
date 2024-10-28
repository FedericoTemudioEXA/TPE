'use strict'

document.addEventListener("DOMContentLoaded", function (){

    //Preloader//
    let number = document.querySelector('#percentage');
    let counter = 0;
    let loader = document.querySelector('#onload');
    setInterval(()=>{
        if(counter==100){
            clearInterval();
            loader.remove(loader);
            document.querySelector('.hidden').style.overflow = "visible";
            document.querySelector('.hidden').style.animation = "fadeOut 1.3s";
        }else{
            counter+=1;
            number.textContent = counter + "%";
        }
    }, 20);
    
    //desplegables//
    let main = document.querySelector(".nav");
    let user = document.querySelector(".user-nav");
    let iconMain =  document.querySelector(".icon-main");
    let icon_user = document.querySelector(".arrow-user")
    let background = document.querySelector(".dark-background");
    let navList = [...document.querySelectorAll(".list-item-main")];
    let socialNav = document.querySelector(".main-social");
    
    //boton menu hamburguesa
    iconMain.addEventListener('click', () =>{
        iconMain.classList.toggle('active-menu');
        iconMain.classList.toggle('not-active');
        if(user.classList.contains('showUser')){
            user.classList.remove('showUser');
            icon_user.classList.toggle("drop-down");
            
        }
        main.classList.toggle("show");
        background.classList.add("on");

        //muestra los items de a uno
        let i = 0;
        if(i < navList.length){  
            setInterval(()=>{
                navList[i].classList.toggle("moveRight");
                i++;
                if(i == navList.length){
                    socialNav.classList.toggle("moveRight");
                }
            },100)   
            
        }
        check();
    });

    //boton imagen usuario
    document.querySelector('.icon-user').addEventListener('click', () =>{
        if(main.classList.contains('show')){
            main.classList.remove('show');   
            iconMain.classList.remove('active-menu');
            iconMain.classList.add('not-active');
        }
        user.classList.toggle("showUser");
        icon_user.classList.toggle("drop-down");
        
        background.classList.add("on");        
        check();
    });

    function check(){
        if(!main.classList.contains('show') && !user.classList.contains('showUser')){         
            background.classList.remove("on");
        }
    }

    background.onclick = function(){
        user.classList.remove('showUser');
        main.classList.remove('show'); 
        background.classList.remove("on");
        iconMain.classList.remove('active-menu');
        iconMain.classList.add('not-active');
        icon_user.classList.remove("drop-down");
    }

    //Reduce el height del header
    let header = document.querySelector('header');
    let logoImg = document.querySelector('.image');
    let userImg = document.querySelector('.nav-user-image')
    let search = document.querySelector('.search-input-content');

    window.addEventListener("scroll", function(){
        if(window.scrollY > 300){
            header.classList.add('reduceSize');
            logoImg.classList.add('reduceSize');
            userImg.classList.add('reduceSize');
            search.classList.add('reduceSize');
        }else{
            header.classList.remove('reduceSize');
            logoImg.classList.remove('reduceSize');
            userImg.classList.remove('reduceSize');
            search.classList.remove('reduceSize');
        }
    })
    
    //Ventana modal
    let modal = document.querySelector('#modal');
    document.querySelector('#openModal').addEventListener('click', ()=>{
        modal.classList.add('modal-flex');
    });
    document.querySelector('#closeModal').addEventListener('click', ()=>{
        modal.classList.remove('modal-flex');
    });
    modal.onclick = function(){
        modal.classList.remove('modal-flex');
    }   

    
});
