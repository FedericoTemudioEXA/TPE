let canvas = document.querySelector('#myCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const CANT_FIG = 30;

let figures = [];
let LastClickedFigure = null;
let isMouseDown = false;

function addFigure(){
    if (Math.random() > 0.5){
        addRect();
    } else {
        addCircle();
    }
    drawFigure();
}
function drawFigure(){
    clearCanvas();
    for (let i = 0; i < figures.length; i++){
        figures[i].draw();
    }
}
function clearCanvas(){
    ctx.fillStyle =  '#F8F8FF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function addRect(){
    let posX = Math.round(Math.random() * canvasWidth);
    let posY = Math.round(Math.random() * canvasHeight);
    let color = 'red';
    let rect = new Rect(posX, posY, 20, 20, color,ctx);
    figures.push(rect);
}

function addCircle(){
    let posX = Math.round(Math.random() * canvasWidth);
    let posY = Math.round(Math.random() * canvasHeight);
    let color = 'blue';
    let circle = new Circle(posX, posY, 10, color, ctx);
    figures.push(circle);
}

function addFigures(){
    addFigure();
    if(figures.length < CANT_FIG){
        setTimeout(addFigures,222);
    }

}
setTimeout(()=>{
    addFigures();
},222);

function onMouseDown(e){
    isMouseDown = true;
    if (LastClickedFigure != null){
        LastClickedFigure.setResaltado(false);
        LastClickedFigure = null;
    }
    let clickFig = findClickedFigure(e.layerX,e.layerY);
    if (clickFig !=null){
        clickFig.setResaltado(true);
        LastClickedFigure = clickFig;
    }
    drawFigure();
}
function onMouseUp(e){
    isMouseDown = false;
}

function onMouseMove(e){
    if (isMouseDown && LastClickedFigure != null){
        LastClickedFigure.setPosition(e.layerX, e.layerY);
        drawFigure();
    }
}

function findClickedFigure(x,y){
    for (let i = 0; i < figures.length; i++){
        const element = figures[i];
        if (element.isPointInside(x,y)){
            return element;
        }
    }
}

canvas.addEventListener('mousedown',onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);