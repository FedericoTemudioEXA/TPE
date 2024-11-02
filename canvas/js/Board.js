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


    placeCircle(circle, col) {
        for (let row = GRID_ROWS - 1; row >= 0; row--) {
            if (this.grid[row][col] === null) {
                this.grid[row][col] = circle;
                circle.isPlaced = true;
                return true;
            }
        }
        return false; // Column is full
    }
}
