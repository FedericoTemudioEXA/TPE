class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.reset();
    }

    reset() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    dropPiece(col, player) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row][col] === 0) {
                this.grid[row][col] = player;
                return row;
            }
        }
        return -1; // Column is full
    }


    checkWin(row, col, player) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

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
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] === player) {
            count++;
            r += dx;
            c += dy;
        }
        return count;
    }

    isFull() {
        return this.grid.every(row => row.every(cell => cell !== 0));
    }
}