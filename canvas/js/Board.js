class Board {
    constructor(ctx, startX, startY, cols, rows, cellSize) {
        this.ctx = ctx;
        this.startX = startX;
        this.startY = startY;
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.width = this.cols * this.cellSize;
        this.height = this.rows * this.cellSize;
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
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
            if (!this.grid[row][col]) {
                return row;
            }
        }
        return -1; // Column is full
    }

    placeCircle(circle, col) {
        const row = this.getLowestEmptyRow(col);
        if (row !== -1) {
            this.grid[row][col] = circle;
            circle.posX = this.startX + col * this.cellSize + this.cellSize / 2;
            circle.posY = this.startY + row * this.cellSize + this.cellSize / 2;
            circle.isAffectedByGravity = false;
            return true;
        }
        return false;
    }
}
