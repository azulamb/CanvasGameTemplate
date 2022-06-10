# CanvasGameTemplage

## これは何？

めちゃくちゃシンプルなCanvasを用いたゲーム作成用のライブラリです。
かなり薄く作っているので以下の特徴を持ちます。

* 全画面描画を想定
  * スクリーンサイズは `<canvas width="横幅" height="高さ">` で指定する。
  * 後述するクリック座標はこのサイズに変換された状態で得られる。
    * 例えばスクリーンの上下に隙間ができる場合、隙間をクリックすると描画領域外の座標が手に入る。
* Canvasのデフォルトの描画命令を使える。
* 画面更新を自動でやってくれる。

## ドキュメント

### SimpleCanvasGameLibrary.prepare()

初期化処理。
すべてのページ初期化が終わって描画などができるようになったらこのライブラリを使えるようになります。

```ts
SimpleCanvasGameLibrary.prepare().then(async (game) => {
	// ここにゲーム処理を書く
});
```

### SimpleCanvasGameLibrary

上のサンプルにある `game` 内のメソッド等です。

#### canvas: [HTMLCanvasElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLCanvasElement)



#### width: number

スクリーンの横幅を入手できます。

#### height: number

スクリーンの高さを入手できます。

#### onClick: OnClickGameScreenHandler | null

クリック時にその座標を得ることができます。

```ts
game.onClick = (event) => {
	// クリック時に呼び出される処理
};
```

`null` を渡すとイベントを解除できます。

##### event.x: number

クリックされた場所のX座標です。スクリーン座標に合わせて変換されています。

左が最小値の `0`で右が最大値の `game.width` となります。
もし横に隙間がある場合は負の値や `game.width` より大きい値が返ってきます。

##### event.y: number

クリックされた場所のX座標です。スクリーン座標に合わせて変換されています。

上が最小値の `0`で下が最大値の `game.height` となります。
もし縦に隙間がある場合は負の値や `game.height` より大きい値が返ってきます。

##### event.event: [PointerEevnt](https://developer.mozilla.org/ja/docs/Web/API/PointerEvent)

生の[PointerEevnt](https://developer.mozilla.org/ja/docs/Web/API/PointerEvent)です。

#### onUpdate

画面の自動更新を行います。

```ts
game.onUpdate = (game) => {
	// 画面更新時に呼び出される処理
};
```

`null` を渡すとイベントを解除できます。

#### clear()

画面をリセットできます。

```ts
SimpleCanvasGameLibrary.prepare().then(async (game) => {
	game.clear();

	game.onUpdate = (game) => {
		// この game と上の game は同じです。
		game.clear();
	};
});
```

#### loadImage(url: string): Promise<[HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)>

画像を読み込みます。ただし非同期処理のため注意が必要です。

```ts
SimpleCanvasGameLibrary.prepare().then(async (game) => {
	// 楽な方法。この画像を読み込み終わるまで次に処理が進みません。
	// 画像読み込みに失敗した場合はすべての処理が止まるので注意してください。
	const image = await game.loadImage('./test.png');

	game.draw.clear();

	// 画像の(16, 0)から16x16の画像を切り出し(320, 240)の位置に32x32で描画
	game.draw.drawImage(image, 16, 0, 16, 16, 320, 240, 32, 32);
});
```

非同期処理を意識した書き方の例は以下です。

```ts
SimpleCanvasGameLibrary.prepare().then(async (game) => {
	// 画像データを入れておく場所
	const images: {[keys: string]: HTMLImageElement} = {};

	game.loadImage('./test.png').then((image) => {
		// 画像読み込みに成功したのでデータに入れる。
		images.test = image;
	});

	// 画面を自動更新
	game.onUpdate = (game) => {
		game.draw.clear();

		// 対象の画像が読み込み終わっているか確認
		if (images.test) {
			// 画像の(16, 0)から16x16の画像を切り出し(320, 240)の位置に32x32で描画
			game.draw.drawImage(images.test, 16, 0, 16, 16, 320, 240, 32, 32);
		}
	};
});
```

#### draw: [CanvasRenderingContext2D](https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D)

`<canvas>` の描画を行う命令群です。
中身はただの [CanvasRenderingContext2D](https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D) なので、公式ドキュメントに書いてある処理を利用可能です。

```ts
SimpleCanvasGameLibrary.prepare().then(async (game) => {
	// キャンバスをクリア
	game.clear();

	// 塗りの色の変更
	game.draw.fillStyle = 'blue';

	// 長方形を塗りつぶしで描画
	game.draw.fillRect(0, 0, game.width, game.height);

	// 塗りの色の変更
	game.draw.fillStyle = 'gray';

	// 長方形を塗りつぶしで描画
	game.draw.fillRect(10, 10, game.width - 20, game.height - 20);
});
```

大雑把に四角形や円などを描画できますが、そのオブジェクトを塗りたい場合は `game.draw.fillStyle` に色情報を設定した後 `game.draw.filなんとか()` というメソッドを呼び出すことでその色で塗られたオブジェクトが描画されます。

枠線に対して塗ることも可能で、その場合は `game.draw.strokeStyle` に色情報等を設定した後、`game.draw.strokeなんとか()` というメソッドを呼び出すと同じように描画が可能です。

## 
