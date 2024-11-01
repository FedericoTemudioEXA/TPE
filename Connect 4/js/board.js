class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array(rows).fill().map(() => Array(cols).fill(0));
        this.currentPlayer = 1;
    }

    dropPiece(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row][col] === 0) {
                this.grid[row][col] = this.currentPlayer;
                return true;
            }
        }
        return false;
    }

    checkWin(row, col) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            count += this.countDirection(row, col, dx, dy);
            count += this.countDirection(row, col, -dx, -dy);

            if (count >= 4) return true;
        }

        return false;
    }

    countDirection(row, col, dx, dy) {
        let count = 0;
        let r = row + dx;
        let c = col + dy;

        while (
            r >= 0 && r < this.rows &&
            c >= 0 && c < this.cols &&
            this.grid[r][c] === this.currentPlayer
        ) {
            count++;
            r += dx;
            c += dy;
        }

        return count;
    }

    isFull() {
        return this.grid[0].every(cell => cell !== 0);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    getTopEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row][col] === 0) {
                return row;
            }
        }
        return -1; // Column is full
    }
}