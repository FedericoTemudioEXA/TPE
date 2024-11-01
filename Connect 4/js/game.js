class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.board = new Board(6, 7);
        
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
        this.pieces = {
            player1: [],
            player2: []
        };
        
        // Create and position pieces for Player 1 (left side)
        for (let i = 0; i < 21; i++) {
            const row = i % 7;
            const col = Math.floor(i / 7);
            const x = (col + 0.5) * this.cellSize;
            const y = (row + 1) * this.cellSize;
            this.pieces.player1.push(new Piece(1, x, y, this.pieceRadius, this.pieceImages[1]));
        }
        
        // Create and position pieces for Player 2 (right side)
        for (let i = 0; i < 21; i++) {
            const row = i % 7;
            const col = Math.floor(i / 7);
            const x = this.canvas.width - (col + 0.5) * this.cellSize;
            const y = (row + 1) * this.cellSize;
            this.pieces.player2.push(new Piece(2, x, y, this.pieceRadius, this.pieceImages[2]));
        }
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
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
            
            this.animateDrop();
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
                
                if (this.board.checkWin(row, col)) {
                    setTimeout(() => {
                        alert(`Player ${this.droppingPiece.player} wins!`);
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

    reset() {
        this.board = new Board(6, 7);
        this.createPieces();
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Draw the board
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const x = col * this.cellSize + this.boardOffsetX;
                const y = row * this.cellSize + this.boardOffsetY;
    
                this.ctx.fillStyle = '#084572';
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    
                this.ctx.beginPath();
                this.ctx.arc(
                    x + this.cellSize / 2,
                    y + this.cellSize / 2,
                    this.pieceRadius,
                    0,
                    Math.PI * 2
                );
                this.ctx.fillStyle = this.getColor(this.board.grid[row][col]);
                this.ctx.fill();
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
    }
    
    

    getColor(player) {
        switch (player) {
            case 0: return 'white';
            case 1: return 'red';
            case 2: return 'yellow';
        }
    }
}
