class Circle extends Figure{
    constructor(posX, posY, radius, color,context,imagenSrc,resaltado,player){
        super(posX, posY, color,context,resaltado)
        this.radius = radius;
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.isAffectedByGravity = false;
        this.isPlaced = false;
        this.player = player;
    }


    applyGravity() {
        if (!this.isAffectedByGravity) return;
        
        if (this.posY < board.startY + board.height && 
            this.posX >= board.startX && 
            this.posX < board.startX + board.width) {
                
            let col = Math.floor((this.posX - board.startX) / board.cellSize);
                
            if (!board.isColumnFull(col)) {
                let targetY = board.startY + board.getLowestEmptyRow(col) * board.cellSize + board.cellSize / 2;
                
                // Move towards the target position
                let dy = targetY - this.posY;
                this.posY += Math.min(dy * 0.2, 10); // Adjust the 0.2 value to change falling speed
        
                // Check if the circle has reached (or nearly reached) its target position
                if (Math.abs(dy) < 1) {
                    board.placeCircle(this, col);
                    this.isPlaced = true;
                    this.isAffectedByGravity = false;
                }
                return;
            }
        }
        
        // If not falling into the grid or the column is full, continue with normal gravity
        if (this.posY + this.radius < canvasHeight) {
            this.posY += 10; // Adjust this value to change falling speed outside the grid
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