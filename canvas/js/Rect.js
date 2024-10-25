class Rect extends Figure {
    constructor(posX, posY, width, height, fill, context) {
        super(posX, posY, fill, context);
        this.width = width;
        this.height = height;

    }
    draw() {
        super.draw();
        this.ctx.fillRect(this.posX, this.posY, this.width, this.height);

        if(this.resaltado === true){
            this.ctx.strokeStyle = this.resaltadoEstilo;
            this.ctx.lineWidth = 5;
            this.ctx.strokeRect(this.posX, this.posY, this.width, this.height);
        }
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }

    isPointInside(x,y){
        return !(x < this.posX || x > this.posX + this.width || y < this.posY || y > this.posY + this.height)
    }

}