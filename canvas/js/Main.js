let canvas = document.querySelector('#myCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const CANT_FIG = 30;

let figures = [];
let LastClickedFigure = null;
let isMouseDown = false;
let coordsCanvas = canvas.getBoundingClientRect();

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
    let color = randomColor();
    let rect = new Rect(posX, posY, 40, 40, color,ctx,'img/megaman.png');
    figures.push(rect);
}

function addCircle(){
    let posX = Math.round(Math.random() * canvasWidth);
    let posY = Math.round(Math.random() * canvasHeight);
    let color = randomColor();
    let circle = new Circle(posX, posY, 20, color, ctx, 'img/bomberman.png');
    figures.push(circle);
}
function randomColor(){
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
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
        LastClickedFigure.isAffectedByGravity = false;
        LastClickedFigure = null;
    }
    let clickFig = findClickedFigure(e.offsetX, e.offsetY);;
    if (clickFig !=null){
        clickFig.setResaltado(true);
        LastClickedFigure = clickFig;
    }
    drawFigure();
}

function onMouseUp(e){
    isMouseDown = false;
    if (LastClickedFigure != null) {
        LastClickedFigure.initGravity();
    }
}

function onMouseMove(e){
    if (isMouseDown && LastClickedFigure != null){
        LastClickedFigure.setPosition(e.offsetX, e.offsetY);
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
function applyGravityToFigures() {
    for (let figure of figures) {
        figure.applyGravity();
    }
}

function gameLoop() {
    if (LastClickedFigure != null) {
        LastClickedFigure.applyGravity();
    }
    drawFigure();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();


canvas.addEventListener('mousedown',onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);