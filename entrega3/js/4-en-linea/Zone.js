class Zone{

    constructor(x, y, width, ctx){
        this.x = x;
        this.y = y;
        this.width = width;
        this.ctx = ctx;
        this.image = new Image();
        this.isTokenInside = false;
        this.token = null;
    }

    setToken(token){
        this.token=token;
    }

    getToken(){
        return this.token;
    }

    drawImg(img){
        if (this.image.src === "") {
            this.image.src = img;
            let loadImg = function () {
                this.ctx.drawImage(this.image, this.x, this.y, this.width, this.width);
            }
            this.image.onload = loadImg.bind(this);

        } else {
            this.ctx.drawImage(this.image, this.x, this.y, this.width, this.width);
        }
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.width);
        this.ctx.stroke();
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

    setX(y){
        this.y = y;
    }

    getIsTokenInside(){
        return this.isTokenInside;
    }

    setIsTokenInside(boolean){
        this.isTokenInside = boolean;
    }

    isDroppedInside(x, y){
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.width;
    }

}