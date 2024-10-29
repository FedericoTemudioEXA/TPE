class Board {
    constructor(ctx, startX, startY, cols, rows, cellSize) {
        this.ctx = ctx;
        this.startX = startX;
        this.startY = startY;
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.grid = Array(rows).fill().map(() => Array(cols).fill(null));
        console.log('Board initialized with dimensions:', rows, 'x', cols);
    }

    draw() {
        // Draw blue background
        this.ctx.fillStyle = '#084572';  // Dark blue color for the background
        this.ctx.fillRect(this.startX - 10, this.startY - 10, this.width + 20, this.height + 20);

        this.ctx.strokeStyle = '#E6B217';  // Gold color for the grid lines
        this.ctx.lineWidth = 2;  // Set the line width for the grid

        // Draw vertical lines
        for (let col = 0; col <= this.cols; col++) {
            this.ctx.beginPath();
            this.ctx.lineTo(this.startX + col * this.cellSize, this.startY + this.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let row = 0; row <= this.rows; row++) {
            this.ctx.beginPath();
            this.ctx.lineTo(this.startX + this.width, this.startY + row * this.cellSize);
            this.ctx.stroke();
        }

        // Draw circular holes
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.ctx.beginPath();
                this.ctx.arc(
                    this.startX + col * this.cellSize + this.cellSize / 2,
                    this.startY + row * this.cellSize + this.cellSize / 2,
                    this.cellSize / 2 - 2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fillStyle = '#FFFFFF';  // White color for empty cells
                this.ctx.fill();
                this.ctx.stroke();  // Also stroke the circles to make them more visible
            }
        }
    }

    isColumnFull(col) {
        return this.grid[0][col] !== null;
    }

    getLowestEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row][col] === null) {
                return row;
            }
        }
        return -1;
    }


    placeCircle(player, col) {
        let row = this.getLowestEmptyRow(col);
        if (row !== -1) {
            this.grid[row][col] = player;
            console.log(`Placed circle for ${player.name} at row ${row}, col ${col}`);
            return true;
        }
        return false;
    }


    checkWin(player) {
        console.log(`Checking win for ${player.name}`);
        
        // Check horizontal
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col <= this.cols - 4; col++) {
                if (this.checkLine(row, col, 0, 1, player)) {
                    console.log(`Horizontal win at row ${row}, starting column ${col}`);
                    return true;
                }
            }
        }
    
        // Check vertical
        for (let row = 0; row <= this.rows - 4; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.checkLine(row, col, 1, 0, player)) {
                    console.log(`Vertical win at column ${col}, starting row ${row}`);
                    return true;
                }
            }
        }
    
        // Check diagonal (top-left to bottom-right)
        for (let row = 0; row <= this.rows - 4; row++) {
            for (let col = 0; col <= this.cols - 4; col++) {
                if (this.checkLine(row, col, 1, 1, player)) {
                    console.log(`Diagonal win (top-left to bottom-right) starting at row ${row}, column ${col}`);
                    return true;
                }
            }
        }
    
        // Check diagonal (top-right to bottom-left)
        for (let row = 0; row <= this.rows - 4; row++) {
            for (let col = 3; col < this.cols; col++) {
                if (this.checkLine(row, col, 1, -1, player)) {
                    console.log(`Diagonal win (top-right to bottom-left) starting at row ${row}, column ${col}`);
                    return true;
                }
            }
        }
    
        console.log('No win detected');
        return false;
    }
    
    checkLine(row, col, rowDelta, colDelta, player) {
        console.log(`Checking line starting at (${row}, ${col}), delta (${rowDelta}, ${colDelta})`);
        let count = 0;
        for (let i = 0; i < 4; i++) {
            let currentRow = row + i * rowDelta;
            let currentCol = col + i * colDelta;
            if (currentRow < 0 || currentRow >= this.rows || currentCol < 0 || currentCol >= this.cols) {
                console.log(`Cell (${currentRow}, ${currentCol}) is out of bounds`);
                return false;
            }
            let cellContent = this.grid[currentRow][currentCol];
            console.log(`Checking cell (${currentRow}, ${currentCol}): ${cellContent ? cellContent.name : 'empty'}, Type: ${typeof cellContent}`);
            if (cellContent === player) {
                count++;
            } else {
                break;
            }
        }
        console.log(`Found ${count} matching pieces`);
        return count === 4;
    }

    printBoard() {
        console.log('Printing board state...');
        console.log('Current Board State:');
        for (let row = 0; row < this.rows; row++) {
            let rowStr = '';
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] === null) {
                    rowStr += '- ';
                } else if (this.grid[row][col] === player1) {
                    rowStr += 'X ';
                } else if (this.grid[row][col] === player2) {
                    rowStr += 'O ';
                } else {
                    rowStr += '? '; // For unexpected values
                }
            }
            console.log(`${row}: ${rowStr}`);
        }
    }
}
