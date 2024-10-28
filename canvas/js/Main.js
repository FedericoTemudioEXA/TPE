let canvas = document.querySelector('#myCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const GRID_COLS = 7;
const GRID_ROWS = 6;
const CELL_SIZE = 50;
const GRID_WIDTH = GRID_COLS * CELL_SIZE;
const GRID_HEIGHT = GRID_ROWS * CELL_SIZE;
const GRID_START_X = (canvasWidth - GRID_WIDTH) / 2;
const GRID_START_Y = (canvasHeight - GRID_HEIGHT) / 2;

let board = new Board(ctx, GRID_START_X, GRID_START_Y, GRID_COLS, GRID_ROWS, CELL_SIZE);

const CANT_FIG = 30;

let figures = [];
let LastClickedFigure = null;
let isMouseDown = false;



function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the board
    board.draw();
    
    // Apply gravity and draw figures
    figures.forEach(figure => {
        if (figure instanceof Circle) {
            figure.applyGravity();
        }
        figure.draw();
    });
}




function addFigure(){
    if (Math.random() > 0.5){
        addCircle('img/megaman.png','blue');
    } else {
        addCircle('img/bomberman.png','red');
    }
    drawFigure();
}
function drawFigure() {
    clearCanvas();
    board.draw();
    for (let i = 0; i < figures.length; i++) {
        figures[i].draw();
    }
}
function clearCanvas() {
    ctx.fillStyle = '#F0F0F0';  // Light gray background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

/*function addRect(){
    let posX = Math.round(Math.random() * canvasWidth);
    let posY = Math.round(Math.random() * canvasHeight);
    let color = randomColor();
    let rect = new Rect(posX, posY, 40, 40, color,ctx,'img/megaman.png');
    figures.push(rect);
}*/

function addCircle(imagen,resaltado){
    let posX, posY;
    if (imagen.includes('megaman')) {
        posX = Math.round(Math.random() * (GRID_START_X - 40));  // Left side
    } else {
        posX = Math.round(GRID_START_X + GRID_WIDTH + Math.random() * (canvasWidth - GRID_START_X - GRID_WIDTH - 40));  // Right side
    }
    posY = Math.round(Math.random() * canvasHeight);
    let color = randomColor();
    let circle = new Circle(posX, posY, 20, color, ctx, imagen,resaltado);
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

function onMouseMove(e) {
    if (isMouseDown && LastClickedFigure != null) {
        let newX = e.offsetX;
        let newY = e.offsetY;
        
        // Prevent dragging into the Connect 4 grid
        if (newX > GRID_START_X - LastClickedFigure.radius && 
            newX < GRID_START_X + GRID_WIDTH + LastClickedFigure.radius &&
            newY > GRID_START_Y - LastClickedFigure.radius && 
            newY < GRID_START_Y + GRID_HEIGHT + LastClickedFigure.radius) {
            return;
        }
        
        LastClickedFigure.setPosition(newX, newY);
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
    for (let figure of figures) {
        figure.applyGravity();
    }
    drawFigure();
    requestAnimationFrame(gameLoop);
}
// Start the game loop
gameLoop();
animate();


canvas.addEventListener('mousedown',onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mousemove', onMouseMove, false);