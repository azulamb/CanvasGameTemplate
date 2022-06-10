class SimpleCanvasGameLibrary {
    static prepare(id = 'screen') {
        return new Promise((resolve) => {
            if (document.readyState !== 'loading') {
                return resolve(new SimpleCanvasGameLibrary(id));
            }
            document.addEventListener('DOMContentLoaded', () => {
                resolve(new SimpleCanvasGameLibrary(id));
            });
        });
    }
    canvas;
    draw;
    onClickHandler;
    onUpdateId;
    constructor(targetId) {
        this.canvas = document.getElementById(targetId);
        this.draw = this.canvas.getContext('2d');
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    set onClick(onClick) {
        if (this.onClickHandler) {
            this.canvas.removeEventListener('click', this.onClickHandler);
        }
        if (!onClick) {
            return;
        }
        this.onClickHandler = (event) => {
            onClick(this.calcClickPosition(event));
        };
        this.canvas.addEventListener('click', this.onClickHandler);
    }
    set onUpdate(onUpdate) {
        if (this.onUpdateId) {
            cancelAnimationFrame(this.onUpdateId);
        }
        if (!onUpdate) {
            return;
        }
        const update = () => {
            onUpdate(this);
            this.onUpdateId = requestAnimationFrame(update);
        };
        update();
    }
    clear() {
        this.draw.clearRect(0, 0, this.width, this.height);
    }
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const image = document.createElement('img');
            image.onabort = reject;
            image.onerror = reject;
            image.onload = () => {
                resolve(image);
            };
            image.src = url;
        });
    }
    calcClickPosition(event) {
        const width = this.width;
        const height = this.height;
        const WIDTH = this.canvas.clientWidth;
        const HEIGHT = this.canvas.clientHeight;
        const x = event.offsetX;
        const y = event.offsetY;
        if (height / width < HEIGHT / WIDTH) {
            const scale = width / WIDTH;
            const h = (HEIGHT - WIDTH * height / width) / 2;
            return { x: x * scale, y: (y - h) * scale, event: event };
        }
        else {
            const scale = height / HEIGHT;
            const w = (WIDTH - HEIGHT * width / height) / 2;
            return { x: (x - w) * scale, y: y * scale, event: event };
        }
    }
}
SimpleCanvasGameLibrary.prepare().then((game) => {
    game.clear();
    game.draw.fillStyle = 'blue';
    game.draw.fillRect(0, 0, game.width, game.height);
    game.draw.fillStyle = 'gray';
    game.draw.fillRect(10, 10, game.width - 20, game.height - 20);
    game.onClick = (event) => {
        console.log(`${event.x} x ${event.y}`);
        game.clear();
        game.draw.fillStyle = 'blue';
        game.draw.fillRect(0, 0, game.width, game.height);
        game.draw.fillStyle = 'gray';
        game.draw.fillRect(10, 10, game.width - 20, game.height - 20);
        game.draw.fillStyle = '#ff0000';
        game.draw.beginPath();
        game.draw.arc(event.x, event.y, 10, 0, Math.PI * 2);
        game.draw.fill();
        game.draw.closePath();
    };
});
