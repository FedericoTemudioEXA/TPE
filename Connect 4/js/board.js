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

    checkWin(row, col, winCondition) {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (let [dx, dy] of directions) {
            let count = 1;
            let pieces = [[row, col]];
            pieces = pieces.concat(this.countPieces(row, col, dx, dy));
            pieces = pieces.concat(this.countPieces(row, col, -dx, -dy));
            if (pieces.length >= winCondition) {
                this.winningPieces = pieces.slice(0,winCondition );
                return true;
            }
        }
        return false;
    }

    countPieces(row, col, dx, dy) {
        const player = this.grid[row][col];
        let pieces = [];
        let x = col + dx;
        let y = row + dy;
        while (y >= 0 && y < this.rows && x >= 0 && x < this.cols && this.grid[y][x] === player) {
            pieces.push([y, x]);
            x += dx;
            y += dy;
        }
        return pieces;
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