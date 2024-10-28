class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
    }

    incrementScore() {
        this.score++;
    }

    resetScore() {
        this.score = 0;
    }
}