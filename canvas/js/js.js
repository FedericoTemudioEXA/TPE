"use strict";
window.addEventListener('load', ()=>{

    document.addEventListener('mousedown', iniciarDibujo);
    document.addEventListener('mousemove', dibujo);
    document.addEventListener('mouseup', detenerDibujo);
});

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

let dibujar = false;

ctx.fillRect(100,100,100,100);

function iniciarDibujo(event){
    dibujar = true;
    getMousePos(event);
}
function getMousePos(event){
    return {
        x: event.clientX - canvas.offsetLeft,
        y: event.clientY - canvas.offsetTop
    }
}
function detenerDibujo(){
    dibujar = false;
}
function dibujo(event){
    if(!dibujar) return;

    const width = 3;
    ctx.beginPath();
    ctx.lineWidth = width;

    let m = getMousePos(event);

    if(
        m.x > 100 && m.x <200
        && m.y > 100 && m.y <200
    ){
        ctx.strokeStyle = '#FFFFFF';
    }else{
        ctx.strokeStyle = '#000000';
    }
    ctx.moveTo(m.x+5, m.y+5);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
}