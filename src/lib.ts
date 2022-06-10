/** スクリーンに対するポインター情報 */
interface OnClickGameScreenHandlerEvent {
	/** イベント発生のX座標（スクリーン座標に変換済み） */
	x: number;
	/** イベント発生のY座標（スクリーン座標に変換済み） */
	y: number;
	/** 元イベント */
	event: PointerEvent;
}

/** クリック時のコールバック関数 */
interface OnClickGameScreenHandler {
	(event: OnClickGameScreenHandlerEvent): unknown;
}

/** 更新時のコールバック関数 */
interface OnUpdateHandler {
	(game: SimpleCanvasGameLibrary): unknown;
}

class SimpleCanvasGameLibrary {
	static prepare(id = 'screen') {
		return new Promise<SimpleCanvasGameLibrary>((resolve) => {
			if (document.readyState !== 'loading') {
				return resolve(new SimpleCanvasGameLibrary(id));
			}
			document.addEventListener('DOMContentLoaded', () => {
				resolve(new SimpleCanvasGameLibrary(id));
			});
		});
	}

	/** 管理対象の<canvas> */
	public canvas: HTMLCanvasElement;
	/** <canvas>の描画周りの命令が入っている */
	public draw: CanvasRenderingContext2D;

	// 管理用変数
	protected onClickHandler: (event: PointerEvent) => unknown;
	protected onUpdateId: number;

	constructor(targetId: string) {
		this.canvas = <HTMLCanvasElement> document.getElementById(targetId);
		this.draw = <CanvasRenderingContext2D> this.canvas.getContext('2d');
	}

	/** <canvas>の描画横幅 */
	get width() {
		return this.canvas.width;
	}

	/** <canvas>の描画高さ */
	get height() {
		return this.canvas.height;
	}

	/** クリックした時のイベントを登録する */
	set onClick(onClick: OnClickGameScreenHandler | null) {
		if (this.onClickHandler) {
			this.canvas.removeEventListener('click', this.onClickHandler);
		}

		if (!onClick) {
			// イベントが設定されていないので解除のみで終了。
			return;
		}

		this.onClickHandler = (event) => {
			onClick(this.calcClickPosition(event));
		};

		this.canvas.addEventListener('click', this.onClickHandler);
	}

	/** 画面更新時に処理を行う */
	set onUpdate(onUpdate: OnUpdateHandler | null) {
		if (this.onUpdateId) {
			cancelAnimationFrame(this.onUpdateId);
		}

		if (!onUpdate) {
			// イベントが設定されていないので解除のみで終了。
			return;
		}

		const update = () => {
			onUpdate(this);
			this.onUpdateId = requestAnimationFrame(update);
		};
		update();
	}

	/** <canvas>をクリアする */
	public clear() {
		this.draw.clearRect(0, 0, this.width, this.height);
	}

	/** 画像を読み込む */
	public loadImage(url: string): Promise<HTMLImageElement> {
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

	/**
	 * マウスの座標を<canvas>の大きさから描画領域内の座標に変換する
	 */
	protected calcClickPosition(event: PointerEvent): OnClickGameScreenHandlerEvent {
		const width = this.width;
		const height = this.height;
		const WIDTH = this.canvas.clientWidth;
		const HEIGHT = this.canvas.clientHeight;
		const x = event.offsetX;
		const y = event.offsetY;

		if (height / width < HEIGHT / WIDTH) {
			// 縦に隙間あり
			const scale = width / WIDTH;
			const h = (HEIGHT - WIDTH * height / width) / 2;
			return { x: x * scale, y: (y - h) * scale, event: event };
		} else {
			// 横に隙間あり
			const scale = height / HEIGHT;
			const w = (WIDTH - HEIGHT * width / height) / 2;
			return { x: (x - w) * scale, y: y * scale, event: event };
		}
	}
}
