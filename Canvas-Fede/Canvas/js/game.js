document.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas', 'gameStatus', 'restartButton', 'resetScoresButton');
});

class Game {
    constructor(canvasId, statusElementId, resetScoresButtonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.statusElement = document.getElementById(statusElementId);
        this.winMessageElement = document.getElementById('winMessage');
        this.winnerTextElement = document.getElementById('winnerText');
        this.restartButton = document.getElementById('restartButton');
        this.resetScoresButton = document.getElementById(resetScoresButtonId);

        this.pieceImages = [
            this.loadImage('img/bomberman.png'),
            this.loadImage('img/Megaman.png')
        ];

        this.ROWS = 6;
        this.COLS = 7;
        this.CELL_SIZE = 100;
        this.RADIUS = 40;
        this.PIECE_MARGIN = 10;
        this.SIDE_WIDTH = this.CELL_SIZE + this.PIECE_MARGIN * 2;

        this.canvas.width = this.SIDE_WIDTH * 2 + this.CELL_SIZE * this.COLS;
        this.canvas.height = Math.max(this.CELL_SIZE * this.ROWS, this.CELL_SIZE * 7);

        this.board = new Board(this.ROWS, this.COLS);
        this.players = [new Player('Player 1', 'red'), new Player('Player 2', 'yellow')];
        this.currentPlayerIndex = 0;

        this.BOARD_COLOR = 'blue';
        this.EMPTY_CELL_COLOR = 'white';

        this.sidePieces = {
            left: Array(7).fill(null).map((_, i) => ({ x: this.PIECE_MARGIN + this.RADIUS, y: (i + 0.5) * this.CELL_SIZE })),
            right: Array(7).fill(null).map((_, i) => ({ x: this.canvas.width - this.PIECE_MARGIN - this.RADIUS, y: (i + 0.5) * this.CELL_SIZE }))
        };

        this.draggedPiece = null;

        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        if (!this.offscreenCtx) {
            console.error('Failed to get 2D context from offscreen canvas');
            return;
        }

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.setupEventListeners();
        this.resetGame();
    }


    setupEventListeners() {
        this.restartButton.addEventListener('click', this.resetGame.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.resetScoresButton.addEventListener('click', this.resetScores.bind(this));
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    drawBoard() {
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the board background
        this.ctx.fillStyle = this.BOARD_COLOR;
        this.ctx.fillRect(this.SIDE_WIDTH, 0, this.CELL_SIZE * this.COLS, this.canvas.height);

        // Draw the cells
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cellValue = this.board.grid[row][col];
                const x = (col + 0.5) * this.CELL_SIZE + this.SIDE_WIDTH;
                const y = (row + 0.5) * this.CELL_SIZE;
                this.drawCell(this.ctx, row, col, cellValue - 1, x, y);
            }
        }

        // Draw side pieces
        for (let i = 0; i < this.sidePieces.left.length; i++) {
            const piece = this.sidePieces.left[i];
            this.drawCell(this.ctx, -1, -1, 0, piece.x, piece.y);
        }
        for (let i = 0; i < this.sidePieces.right.length; i++) {
            const piece = this.sidePieces.right[i];
            this.drawCell(this.ctx, -1, -1, 1, piece.x, piece.y);
        }
    }

    drawCell(context, row, col, playerIndex, x, y) {
        context.beginPath();
        context.arc(x, y, this.RADIUS, 0, Math.PI * 2);
        context.fillStyle = this.EMPTY_CELL_COLOR;
        context.fill();
        context.strokeStyle = this.BOARD_COLOR;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        if (playerIndex !== -1 && this.pieceImages[playerIndex] && this.pieceImages[playerIndex].complete) {
            const img = this.pieceImages[playerIndex];
            context.save();
            context.beginPath();
            context.arc(x, y, this.RADIUS, 0, Math.PI * 2);
            context.clip();
            context.drawImage(img, x - this.RADIUS, y - this.RADIUS, this.RADIUS * 2, this.RADIUS * 2);
            context.restore();
        }
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const col = Math.floor(x / this.CELL_SIZE);
        this.dropPiece(col);
    }


    handleMouseMove(event) {
        if (this.draggedPiece) {
            const rect = this.canvas.getBoundingClientRect();
            this.draggedPiece.x = event.clientX - rect.left;
            this.draggedPiece.y = event.clientY - rect.top;
            
            requestAnimationFrame(() => {
                this.drawBoard();
                this.drawCell(this.ctx, -1, -1, this.currentPlayerIndex, this.draggedPiece.x, this.draggedPiece.y);
            });
        }
    }

    drawDraggedPiece() {
        if (this.draggedPiece) {
            this.drawCell(this.ctx, -1, -1, this.currentPlayerIndex, this.draggedPiece.x, this.draggedPiece.y);
        }
    }

    handleMouseDown(event) {
        if (this.gameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const side = x < this.SIDE_WIDTH ? 'left' : x > this.canvas.width - this.SIDE_WIDTH ? 'right' : 'board';
        if (side !== 'board' && side === (this.currentPlayerIndex === 0 ? 'left' : 'right')) {
            const pieceIndex = this.sidePieces[side].findIndex(piece => 
                Math.sqrt((x - piece.x)**2 + (y - piece.y)**2) < this.RADIUS);
            if (pieceIndex !== -1) {
                this.draggedPiece = { side, index: pieceIndex, x, y };
                document.addEventListener('mousemove', this.handleMouseMove.bind(this));
                document.addEventListener('mouseup', this.handleMouseUp.bind(this));
            }
        }
    }

    handleMouseUp(event) {
        if (this.draggedPiece) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const col = Math.floor((x - this.SIDE_WIDTH) / this.CELL_SIZE);
            if (col >= 0 && col < this.COLS) {
                this.dropPiece(col);
                this.sidePieces[this.draggedPiece.side].splice(this.draggedPiece.index, 1);
            }
            this.draggedPiece = null;
            this.drawBoard();
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
        }
    }

    dropPiece(col) {
        const row = this.board.getLowestEmptyRow(col);
        if (row !== -1) {
            this.animateDrop(row, col, () => {
                if (this.board.checkWin(row, col, this.currentPlayerIndex + 1)) {
                    this.gameOver = true;
                    this.players[this.currentPlayerIndex].score++;
                    this.showWinMessage(`${this.players[this.currentPlayerIndex].name} wins!`);
                    this.updateScoreDisplay();
                } else if (this.board.isFull()) {
                    this.gameOver = true;
                    this.showWinMessage("It's a draw!");
                } else {
                    this.switchPlayer();
                }
                this.drawBoard();
            });
        }
    }

    animateDrop(endRow, col, callback) {
        let currentRow = -1;
        const animationSpeed = 0.2; // Adjust this value to change the speed of the animation
        const x = (col + 0.5) * this.CELL_SIZE + this.SIDE_WIDTH;
    
        const animate = () => {
            this.drawBoard();
    
            currentRow += animationSpeed;
    
            if (currentRow < endRow) {
                const y = currentRow * this.CELL_SIZE + this.CELL_SIZE / 2;
                this.drawCell(this.ctx, -1, -1, this.currentPlayerIndex, x, y);
                requestAnimationFrame(animate);
            } else {
                // Update the board state
                this.board.grid[endRow][col] = this.currentPlayerIndex + 1;
                this.drawBoard(); // Redraw the board with the new piece in place
                if (callback) callback();
            }
        };
    
        // Temporarily remove the piece from the board for the animation
        this.board.grid[endRow][col] = 0;
        animate();
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        this.upda
    }

    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.style.color = this.players[this.currentPlayerIndex].color;
        }
    }

    checkWin(row, col) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];
        const player = this.currentPlayerIndex + 1;

        for (let [dx, dy] of directions) {
            let count = 1;
            count += this.countDirection(row, col, dx, dy, player);
            count += this.countDirection(row, col, -dx, -dy, player);

            if (count >= 4) return true;
        }

        return false;
    }


    countDirection(row, col, dx, dy, player) {
        let count = 0;
        let r = row + dx;
        let c = col + dy;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board.grid[r][c] === player) {
            count++;
            r += dx;
            c += dy;
        }
        return count;
    }



    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        this.updateStatus();
    }

    updateStatus() {
        ;
        this.statusElement.style.color = this.players[this.currentPlayerIndex].color;
    }

    showWinMessage(message) {
        this.winnerTextElement.textContent = message;
        this.winMessageElement.style.display = 'block';
    }


    resetGame() {
        this.board.reset();
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winMessageElement.style.display = 'none';
        this.sidePieces = {
            left: Array(7).fill(null).map((_, i) => ({ x: this.PIECE_MARGIN + this.RADIUS, y: (i + 0.5) * this.CELL_SIZE })),
            right: Array(7).fill(null).map((_, i) => ({ x: this.canvas.width - this.PIECE_MARGIN - this.RADIUS, y: (i + 0.5) * this.CELL_SIZE }))
        };
        this.drawBoard();
        this.updateStatus(`${this.players[this.currentPlayerIndex].name}'s turn`);
    }


    resetScores() {
        this.players.forEach(player => player.resetScore());
        this.updateScoreDisplay();
        this.resetGame();
    }

    updateScoreDisplay() {
        this.players.forEach((player, index) => {
            const scoreElement = document.getElementById(`player${index + 1}Score`);
            if (scoreElement) {
                scoreElement.textContent = `${player.name}: ${player.score}`;
            }
        });
    }



}