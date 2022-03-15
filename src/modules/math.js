class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Add(vec) {
        return new Vector2D(
            this.x + vec.x, 
            this.y + vec.y
        );
    }

    Subtract(vec) {
        return new Vector2D(
            this.x - vec.x, 
            this.y - vec.y
        );
    }
}

export {
    Vector2D
}