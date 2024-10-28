class Rect extends Figure {
    constructor(posX, posY, width, height, fill, context, imagenSrc,resaltado) {
        super(posX, posY, fill, context);
        this.width = width;
        this.height = height;
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
            if (this.posY + this.height > canvasHeight) {  // Use this.radius for Circle
                this.posY = canvasHeight - this.height;  // Use this.radius for Circle
                this.velocityY *= -this.bounce;
    
                // Stop applying gravity if the bounce is very small
                if (Math.abs(this.velocityY) < 0.1) {
                    this.isAffectedByGravity = false;
                    this.velocityY = 0;
                }
            }
        }
    }

    draw() {
        super.draw();
        this.ctx.fillRect(this.posX, this.posY, this.width, this.height);
        this.ctx.drawImage(this.imagen,this.posX, this.posY, this.width, this.height);

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