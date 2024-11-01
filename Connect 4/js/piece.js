class Piece {
    constructor(player, x, y, radius, image) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.image = image;
        this.isDragging = false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    isPointInside(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.radius;
    }
}
