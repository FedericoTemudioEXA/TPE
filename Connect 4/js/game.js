class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.board = new Board(6, 7);
        this.winCondition = 4; // Default to Connect 4
        
        this.cellSize = 80; // Fixed cell size
        this.pieceRadius = this.cellSize / 2 - 5;

        // Calculate canvas size based on game elements
        this.canvas.width = this.cellSize * (this.board.cols + 6); // 3 columns for pieces on each side
        this.canvas.height = this.cellSize * (this.board.rows + 2);

        // Calculate the board position
        this.boardOffsetX = this.cellSize * 3; // 3 columns for pieces on left side
        this.boardOffsetY = this.cellSize / 2;

        this.animationSpeed = 15; // pixels per frame
        this.droppingPiece = null;

        this.pieceImages = {
            1: new Image(),
            2: new Image()
        };
        this.pieceImages[1].src = 'img/bomberman.png';
        this.pieceImages[2].src = 'img/Megaman.png';



        this.player1Score = 0;
        this.player2Score = 0;
        this.gameTime = 600; // 10 minutes in seconds
        this.timer = null;
        this.gameOver = false;
        
        // Create UI elements
        this.createUIElements();
        
    
        // Make sure images are loaded before starting the game
        Promise.all([
            new Promise(resolve => this.pieceImages[1].onload = resolve),
            new Promise(resolve => this.pieceImages[2].onload = resolve)
        ]).then(() => {
            this.createPieces();
            this.draw();
        });

        this.createPieces();
        this.draggedPiece = null;
        this.addEventListeners();
        this.draw();
    }
    
    createPieces() {
        const totalPieces = Math.floor((this.board.rows * this.board.cols) / 2);
        this.pieces = {
            player1: [],
            player2: []
        };

        for (let i = 0; i < totalPieces; i++) {
            const row = i % this.board.rows;
            const col = Math.floor(i / this.board.rows);
            const x = col * this.cellSize + this.boardOffsetX + this.cellSize / 2;
            const y = (row + 1) * this.cellSize;
            this.pieces.player1.push(new Piece(1, x, y, this.pieceRadius, this.pieceImages[1]));
        }

        for (let i = 0; i < totalPieces; i++) {
            const row = i % this.board.rows;
            const col = Math.floor(i / this.board.rows);
            const x = this.canvas.width - (col + 0.5) * this.cellSize;
            const y = (row + 1) * this.cellSize;
            this.pieces.player2.push(new Piece(2, x, y, this.pieceRadius, this.pieceImages[2]));
        }
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.getElementById('connect4').addEventListener('click', () => this.changeWinCondition(4));
        document.getElementById('connect5').addEventListener('click', () => this.changeWinCondition(5));
        document.getElementById('connect6').addEventListener('click', () => this.changeWinCondition(6));
        document.getElementById('connect7').addEventListener('click', () => this.changeWinCondition(7));
    }


    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const allPieces = [...this.pieces.player1, ...this.pieces.player2];
        for (const piece of allPieces) {
            if (piece.isPointInside(x, y) && piece.player === this.board.currentPlayer) {
                this.draggedPiece = piece;
                this.draggedPiece.isDragging = true;
                break;
            }
        }
    }

    onMouseMove(e) {
        if (this.draggedPiece) {
            const rect = this.canvas.getBoundingClientRect();
            this.draggedPiece.x = e.clientX - rect.left;
            this.draggedPiece.y = e.clientY - rect.top;
            this.draw();
        }
    }

    onMouseUp(e) {
        if (this.draggedPiece) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const col = Math.floor((x - this.boardOffsetX) / this.cellSize);
    
            if (col >= 0 && col < this.board.cols) {
                this.makeMove(col);
            }
    
            // Reset the dragging state
            this.draggedPiece = null;
            this.draw();
        }
    }
    
    makeMove(col) {
        if (this.gameOver) return;
        const row = this.board.getTopEmptyRow(col);
        if (row !== -1) {
            const finalY = row * this.cellSize + this.boardOffsetY + this.cellSize / 2;
            const startY = this.boardOffsetY - this.cellSize / 2;
            
            // Remove the piece from the player's pieces array
            const playerPieces = this.board.currentPlayer === 1 ? this.pieces.player1 : this.pieces.player2;
            const pieceIndex = playerPieces.indexOf(this.draggedPiece);
            if (pieceIndex > -1) {
                playerPieces.splice(pieceIndex, 1);
            }
            
            this.droppingPiece = {
                player: this.board.currentPlayer,
                x: col * this.cellSize + this.boardOffsetX + this.cellSize / 2,
                y: startY,
                finalY: finalY
            };
            
            this.animateDrop(() => {
                this.board.grid[row][col] = this.board.currentPlayer;
                
                if (this.checkWin(row, col)) {
                    this.endGame(`Player ${this.board.currentPlayer} wins!`);
                    this.board.currentPlayer === 1 ? this.player1Score++ : this.player2Score++;
                } else if (this.checkDraw()) {
                    this.endGame("It's a draw!");
                } else {
                    this.board.switchPlayer();
                }
                
                this.updateUI();
            });
        }
    }

    
    

    animateDrop() {
        if (this.droppingPiece) {
            this.droppingPiece.y += this.animationSpeed;
            
            if (this.droppingPiece.y >= this.droppingPiece.finalY) {
                this.droppingPiece.y = this.droppingPiece.finalY;
                const col = Math.floor((this.droppingPiece.x - this.boardOffsetX) / this.cellSize);
                const row = Math.floor((this.droppingPiece.y - this.boardOffsetY) / this.cellSize);
                
                this.board.grid[row][col] = this.droppingPiece.player;
                
                if (this.board.checkWin(row, col,this.winCondition)) {
                    this.droppingPiece.player === 1 ? this.player1Score++ : this.player2Score++;
                    this.updateUI();
                    const player = this.droppingPiece.player === 1 ? 'Player 1' : 'Player 2';
                    setTimeout(() => {
                        alert(`${player}  wins!`);
                        this.reset();
                    }, 100);
                } else if (this.board.isFull()) {
                    setTimeout(() => {
                        alert("It's a draw!");
                        this.reset();
                    }, 100);
                } else {
                    this.board.switchPlayer();
                }
                
                this.droppingPiece = null;
            }
            
            this.draw();
            requestAnimationFrame(() => this.animateDrop());
        } 
    }

    findLastRow(col) {
        for (let row = this.board.rows - 1; row >= 0; row--) {
            if (this.board.grid[row][col] !== 0) {
                return row;
            }
        }
        return -1;
    }
    changeWinCondition(newCondition) {
        this.winCondition = newCondition;
        this.reset();
        this.updateUI();
    }
    endGame(message) {
        this.gameOver = true;
        this.stopTimer();
        this.showMessage(message);
    }
    startNewGame() {
        this.board = new Board(6, 7);
        this.gameOver = false;
        this.gameTime = 600;
        this.stopTimer();
        this.startTimer();
        this.showMessage('');
        this.updateUI();
        this.createPieces();
        this.draw();
    }

    reset() {
        // Adjust the board size based on the win condition
        const rows = this.winCondition + 2;
        const cols = this.winCondition + 3;
        this.board = new Board(rows, cols);
        this.droppingPiece = null;
        this.gameOver = false;
        this.createPieces(); // Recreate pieces for the new board size
        this.draw();
        this.updateUI();
    }
    

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cellSize = Math.min(this.canvas.width / this.board.cols, this.canvas.height / this.board.rows);
        this.pieceRadius = this.cellSize * 0.4;
        this.boardOffsetX = (this.canvas.width - this.cellSize * this.board.cols) / 2;
        this.boardOffsetY = (this.canvas.height - this.cellSize * this.board.rows) / 2;
    
        // Draw the board
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const x = col * this.cellSize + this.boardOffsetX;
                const y = row * this.cellSize + this.boardOffsetY;
    
                // Draw cell background
                this.ctx.fillStyle = '#084572';
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    
                const cellValue = this.board.grid[row][col];
                if (cellValue === 0) {
                    // Draw empty cell
                    this.ctx.beginPath();
                    this.ctx.arc(
                        x + this.cellSize / 2,
                        y + this.cellSize / 2,
                        this.pieceRadius,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fillStyle = 'white';
                    this.ctx.fill();
                } else {
                    // Draw piece image
                    const pieceImage = this.pieceImages[cellValue];
                    this.ctx.drawImage(
                        pieceImage,
                        x + (this.cellSize - this.pieceRadius * 2) / 2,
                        y + (this.cellSize - this.pieceRadius * 2) / 2,
                        this.pieceRadius * 2,
                        this.pieceRadius * 2
                    );
                }
            }
        }
        // Draw all the pieces
        [...this.pieces.player1, ...this.pieces.player2].forEach(piece => piece.draw(this.ctx));
    
        // Draw the dropping piece if there is one
        if (this.droppingPiece) {
            this.ctx.drawImage(
                this.pieceImages[this.droppingPiece.player],
                this.droppingPiece.x - this.pieceRadius,
                this.droppingPiece.y - this.pieceRadius,
                this.pieceRadius * 2,
                this.pieceRadius * 2
            );
        }

        if (this.gameOver) {
            this.highlightWinningPieces();
        }
    }
    highlightWinningPieces() {
        const borderWidth = 3;
        const borderColor = 'lime';
    
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
    
        for (const [row, col] of this.winningPieces) {
            const x = col * this.cellSize + this.boardOffsetX;
            const y = row * this.cellSize + this.boardOffsetY;
    
            this.ctx.beginPath();
            this.ctx.arc(
                x + this.cellSize / 2,
                y + this.cellSize / 2,
                this.pieceRadius - borderWidth / 2,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
        }
    }
    
    
    

    getColor(player) {
        switch (player) {
            case 0: return 'white';
            case 1: return 'red';
            case 2: return 'yellow';
        }
    }




    createUIElements() {
        this.scoreElement = document.createElement('div');
        this.scoreElement.id = 'score';
        document.body.appendChild(this.scoreElement);
    
        this.timerElement = document.createElement('div');
        this.timerElement.id = 'timer';
        document.body.appendChild(this.timerElement);
    
        this.messageElement = document.createElement('div');
        this.messageElement.id = 'message';
        document.body.appendChild(this.messageElement);
    
        this.resetButton = document.createElement('button');
        this.resetButton.textContent = 'New Game';
        this.resetButton.addEventListener('click', () => this.startNewGame());
        document.body.appendChild(this.resetButton);
    }
    
    updateUI() {
        this.scoreElement.textContent = `Player 1: ${this.player1Score} | Player 2: ${this.player2Score}`;
        this.timerElement.textContent = `Time: ${Math.floor(this.gameTime / 60)}:${(this.gameTime % 60).toString().padStart(2, '0')}`;
    }
    
    showMessage(message) {
        this.messageElement.textContent = message;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.gameTime--;
            if (this.gameTime <= 0) {
                this.endGame('Time\'s up! It\'s a draw.');
            }
            this.updateUI();
        }, 1000);
    }
    
    stopTimer() {
        clearInterval(this.timer);
    }
}
