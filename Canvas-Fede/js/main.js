document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas', 'gameStatus', 'restartButton', 'resetScoresButton');
    // You might need to set the canvas size here if it's not set in HTML
    // game.canvas.width = /* calculate based on CELL_SIZE, COLS, and SIDE_WIDTH */;
    // game.canvas.height = /* calculate based on CELL_SIZE and ROWS */;
    game.resetGame(); // This will draw the initial board
});


























