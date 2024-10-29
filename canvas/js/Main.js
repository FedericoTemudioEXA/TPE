// Canvas setup
let canvas = document.querySelector('#myCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Constants
const GRID_COLS = 7;
const GRID_ROWS = 6;
const CELL_SIZE = 50;
const GRID_WIDTH = GRID_COLS * CELL_SIZE;
const GRID_HEIGHT = GRID_ROWS * CELL_SIZE;
const GRID_START_X = (canvasWidth - GRID_WIDTH) / 2;
const GRID_START_Y = (canvasHeight - GRID_HEIGHT) / 2;
const CANT_FIG = 42;

// Game objects
const player1 =new Player("Player 1", "blue");
const player2 = new Player("Player 2", "red");
let currentPlayer = player1;
let board = new Board(ctx, GRID_START_X, GRID_START_Y, GRID_COLS, GRID_ROWS, CELL_SIZE);

// Game state
let figures = [];
let LastClickedFigure = null;
let isMouseDown = false;

// Drawing functions
function drawPlayerNames() {
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';

    // Player 1 name and score (left side)
    ctx.fillStyle = player1.color;
    let player1NameX = GRID_START_X / 2;
    let player1NameY = GRID_START_Y - 50;
    ctx.fillText(`${player1.name}: ${player1.score}`, player1NameX, player1NameY);

    // Player 2 name and score (right side)
    ctx.fillStyle = player2.color;
    let player2NameX = GRID_START_X + GRID_WIDTH + (canvasWidth - GRID_START_X - GRID_WIDTH) / 2;
    let player2NameY = GRID_START_Y - 50;
    ctx.fillText(`${player2.name}: ${player2.score}`, player2NameX, player2NameY);
}
function drawFigure() {
    clearCanvas();
    board.draw();
    for (let i = 0; i < figures.length; i++) {
        figures[i].draw();
    }
    drawPlayerNames();
}

function clearCanvas() {
    ctx.fillStyle = '#F0F0F0';  // Light gray background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Game logic functions
function switchPlayer() {
    console.log("Switching player from", currentPlayer.name);
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    console.log("to", currentPlayer.name);
}

function updateScore(player, points) {
    player.score += points;
    drawPlayerNames(); // Redraw names and scores
}


function addFigure(){
    if (figures.length % 2 === 0){
        addCircle('img/megaman.png','blue',player1);
    } else {
        addCircle('img/bomberman.png','red',player2);
    }
    drawFigure();
}

function addCircle(imagen, resaltado, player) {
    const circleRadius = 20;
    const gridColumns = 3; // Number of columns in the grid for each player
    const horizontalGap = 10; // Gap between columns
    const verticalGap = 10; // Gap between rows

    let posX, posY;
    let playerCircles = figures.filter(f => f.player === player);
    let circleIndex = playerCircles.length;
    let row = Math.floor(circleIndex / gridColumns);
    let col = circleIndex % gridColumns;

    if (player === player1) {
        // Megaman (Player 1) on the left
        let gridWidth = (circleRadius * 2 * gridColumns) + (horizontalGap * (gridColumns - 1));
        let startX = (GRID_START_X - gridWidth) / 2;
        posX = startX + col * (circleRadius * 2 + horizontalGap) + circleRadius;
    } else {
        // Bomberman (Player 2) on the right
        let gridWidth = (circleRadius * 2 * gridColumns) + (horizontalGap * (gridColumns - 1));
        let startX = GRID_START_X + GRID_WIDTH + (canvasWidth - GRID_START_X - GRID_WIDTH - gridWidth) / 2;
        posX = startX + col * (circleRadius * 2 + horizontalGap) + circleRadius;
    }

    let gridHeight = (circleRadius * 2 * Math.ceil(CANT_FIG / 2 / gridColumns)) + (verticalGap * (Math.ceil(CANT_FIG / 2 / gridColumns) - 1));
    let startY = (canvasHeight - gridHeight) / 2;
    posY = startY + row * (circleRadius * 2 + verticalGap) + circleRadius;

    let circle = new Circle(posX, posY, circleRadius, resaltado, ctx, imagen, resaltado, player);
    figures.push(circle);
}

// Animation and game loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    board.draw();
    drawPlayerNames();
    
    figures.forEach(figure => {
        if (figure instanceof Circle) {
            figure.applyGravity();
        }
        figure.draw();
    });
}

function gameLoop() {
    for (let figure of figures) {
        figure.applyGravity();
    }
    drawFigure();
    drawPlayerNames();
    requestAnimationFrame(gameLoop);
}

// Event listeners
function onMouseDown(e) {
    isMouseDown = true;
    if (LastClickedFigure != null) {
        LastClickedFigure.setResaltado(false);
        LastClickedFigure.isAffectedByGravity = false;
        LastClickedFigure = null;
    }
    let clickFig = findClickedFigure(e.offsetX, e.offsetY);
    if (clickFig != null && clickFig.player === currentPlayer) {
        clickFig.setResaltado(true);
        LastClickedFigure = clickFig;
        LastClickedFigure.isAffectedByGravity = false;
    }
    drawFigure();
}

function onMouseUp(e) {
    isMouseDown = false;
    if (LastClickedFigure && LastClickedFigure.player === currentPlayer) {
        LastClickedFigure.isAffectedByGravity = true;
        
        // Wait for the piece to settle
        setTimeout(() => {
            // Get the column where the piece landed
            let col = Math.floor((LastClickedFigure.posX - GRID_START_X) / CELL_SIZE);
            
            // Find the lowest empty row in this column
            let row = GRID_ROWS - 1;
            while (row >= 0 && board.grid[row][col] !== null) {
                row--;
            }
            
            if (board.placeCircle(currentPlayer, col)) {
                console.log(`Placed piece for ${currentPlayer.name} at column ${col}`);
                board.printBoard();
                
                if (board.checkWin(currentPlayer)) {
                    console.log(`${currentPlayer.name} wins!`);
                    updateScore(currentPlayer, 1);
                    alert(`${currentPlayer.name} wins!`);
                    // You might want to reset the game here
                } else {
                    switchPlayer();
                }
            }
        }, 500); // Adjust this delay as needed
    }
    drawFigure();
}
function onMouseMove(e) {
    if (isMouseDown && LastClickedFigure != null) {
        let newX = e.offsetX;
        let newY = e.offsetY;
        
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

function findClickedFigure(x, y) {
    for (let i = 0; i < figures.length; i++) {
        const element = figures[i];
        if (element.isPointInside(x, y) && !element.isPlaced) {
            return element;
        }
    }
}

// Initialization
function init() {
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mousemove', onMouseMove, false);

    animate();
    gameLoop();
    
    setTimeout(() => {
        addFigures();
    }, 222);
}

function addFigures() {
    addFigure();
    if (figures.length < CANT_FIG) {
        setTimeout(addFigures, 22);
    }
}

// Start the game
init();

