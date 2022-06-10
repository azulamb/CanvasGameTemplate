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
SimpleCanvasGameLibrary.prepare().then(async (game) => {
    const position = { x: 320, y: 240 };
    let frame = 0;
    const image = await game.loadImage('./test.png');
    game.onUpdate = (game) => {
        ++frame;
        game.clear();
        game.draw.fillStyle = 'blue';
        game.draw.fillRect(0, 0, game.width, game.height);
        game.draw.fillStyle = 'gray';
        game.draw.fillRect(10, 10, game.width - 20, game.height - 20);
        game.draw.drawImage(image, 16, 0, 16, 16, 320, 240, 32, 32);
        game.draw.fillStyle = '#ff0000';
        game.draw.beginPath();
        game.draw.arc(position.x, position.y, 10, 0, Math.PI * 2);
        game.draw.fill();
        game.draw.closePath();
        game.draw.fillStyle = 'white';
        game.draw.textBaseline = 'top';
        game.draw.fillText(`Frame: ${frame}`, 0, 0);
    };
    game.onClick = (event) => {
        position.x = event.x;
        position.y = event.y;
    };
    document.getElementById('stop')?.addEventListener('click', () => {
        game.onUpdate = null;
    });
});
