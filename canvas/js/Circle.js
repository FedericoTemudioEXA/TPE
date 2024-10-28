class Circle extends Figure{
    constructor(posX, posY, radius, color,context,imagenSrc,resaltado){
        super(posX, posY, color,context,resaltado)
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

    /*applyGravity() {
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
    }*/
        applyGravity() {
            if (!this.isAffectedByGravity) return;
        
            // Check if the circle is above or inside the grid
            if (this.posY < GRID_START_Y + GRID_HEIGHT && 
                this.posX >= GRID_START_X && 
                this.posX < GRID_START_X + GRID_WIDTH) {
                
                // Find the column the circle is falling into
                let col = Math.floor((this.posX - GRID_START_X) / CELL_SIZE);
                
                if (!isColumnFull(col)) {
                    let row = getLowestEmptyRow(col);
                    if (row !== -1) {
                        // Calculate the target position
                        let targetX = GRID_START_X + col * CELL_SIZE + CELL_SIZE / 2;
                        let targetY = GRID_START_Y + row * CELL_SIZE + CELL_SIZE / 2;
        
                        // Move towards the target position
                        let dx = targetX - this.posX;
                        let dy = targetY - this.posY;
                        
                        // Adjust these values to change the falling speed
                        this.posX += dx * 0.1;
                        this.posY += Math.min(dy * 0.1, 5); // Limit the falling speed
        
                        // Check if the circle has reached (or nearly reached) its target position
                        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                            this.posX = targetX;
                            this.posY = targetY;
                            this.isAffectedByGravity = false;
                            grid[row][col] = this;
                        }
                        return;
                    }
                }
            }
        
            // If not falling into the grid or the column is full, continue with normal gravity
            if (this.posY + this.radius < canvasHeight) {
                this.posY += 5; // Adjust this value to change falling speed outside the grid
            } else {
                this.posY = canvasHeight - this.radius;
                this.isAffectedByGravity = false;
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