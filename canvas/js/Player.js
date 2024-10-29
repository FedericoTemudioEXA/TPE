class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
    }

    
    addScore(points) {
        this.score += points;
    }
    getScore(){
        return this.score;
    }
    getName(){
        return this.name;
    }
    getColor(){
        return this.color;
    }
    resetScore(){
        this.score = 0;
    }
}
