class Token{

    constructor(x, y, radius, ctx, player){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.player = player;
        this.selected = false;
        this.canMove = true;
        this.image = new Image();
    }

    getPlayer(){
        return this.player;
    }

    setCanMove(boolean){
        this.canMove = boolean;
    }

    isSelected(){
        return this.isSelected;
    }

    setIsSelected(boolean){
        this.selected = boolean;
    }

    getX(){
        return this.x;
    }

    setX(x){
        this.x = x;
    }

    getY(){
        return this.y;
    }
    setY(y){
        this.y = y;
    }
    getRadius(){
        return this.radius;
    }
    setRadius(radius){
        this.radius = radius;
    }
    draw(){
        this.ctx.beginPath();
        this.ctx.arc(this.x , this.y , this.radius , 0, 2 * Math.PI);
        this.ctx.fillStyle = "blue";
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawImg(img){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        if (this.image.src === "") {
            this.image.src = img;
            let loadImg = function () {
                this.ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius / .6, this.radius / .6);
            }
            this.image.onload = loadImg.bind(this);
        } else {
            this.ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius / .6, this.radius / .6);
        }
    }

    setImage(img){
        this.image.src = img;
    }

    isClicked(x,y){
        if(this.canMove){
            let distancia = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
            if(distancia > this.radius){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    move(x, y){
        this.x = x;
        this.y = y;
    }

    //raiz[(punto1.x - cx)^2+(punto1.y-c.y)^2]   c es el punto centra
}