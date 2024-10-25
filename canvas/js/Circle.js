class Circle extends Figure{
    constructor(posX, posY, radius, color,context,imagenSrc){
        super(posX, posY, color,context)
        this.radius = radius;
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.bounce = 0.7;
        this.isAffectedByGravity = false;
    }


    initGravity() {
        this.velocityY = 0;
        this.isAffectedByGravity = true;
    }

    applyGravity() {
        if (this.isAffectedByGravity) {
            this.velocityY += this.gravity;
            this.posY += this.velocityY;
    
            // Check for bottom collision
            if (this.posY + this.radius > canvasHeight) {
                this.posY = canvasHeight - this.radius;
                this.velocityY *= -this.bounce;
    
                // Stop applying gravity if the bounce is very small
                if (Math.abs(this.velocityY) < 0.1) {
                    this.isAffectedByGravity = false;
                    this.velocityY = 0;
                }
            }
        }
    }
    draw(){
        super.draw(0);
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        this.ctx.clip();
        this.ctx.drawImage(this.imagen, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
        this.ctx.restore();
        

        if(this.resaltado === true){
            this.ctx.strokeStyle = this.resaltadoEstilo;
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }
        this.ctx.closePath();
    }




    getRadius(){
        return this.radius;
    }
    isPointInside(x, y){
        let _x = this.posX - x;
        let _y = this.posY - y;
        return Math.sqrt(_x * _x + _y * _y) < this.radius;
    }
}