// メインのファイル

// サンプル1
SimpleCanvasGameLibrary.prepare().then((game) => {
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

	// クリックイベントを登録
	game.onClick = (event) => {
		// クリック座標（スクリーン座標変換済み）を取得
		console.log(`${event.x} x ${event.y}`);
		// console.log(event);

		// 背景の描き直し
		game.clear();
		game.draw.fillStyle = 'blue';
		game.draw.fillRect(0, 0, game.width, game.height);
		game.draw.fillStyle = 'gray';
		game.draw.fillRect(10, 10, game.width - 20, game.height - 20);

		// クリック地点に赤い丸を描く
		game.draw.fillStyle = '#ff0000'; // redでも良い
		game.draw.beginPath();
		game.draw.arc(event.x, event.y, 10, 0, Math.PI * 2);
		game.draw.fill();
		game.draw.closePath();
	};
});

// サンプル2
/*SimpleCanvasGameLibrary.prepare().then(async (game) => {
	// 円のデータ
	const position = { x: 320, y: 240 };
	// フレーム数
	let frame = 0;

	// テストのために背景を透過していない32x32のpng画像
	const image = await game.loadImage('./test.png');

	// ブラウザの描画に合わせてだいたい60FPSくらいでいい感じに呼び出される処理の追加
	game.onUpdate = (game) => {
		// フレーム数をカウントアップ
		++frame;

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

		// 画像を描画
		// (16, 0)から16x16の画像を切り出し(320, 240)の位置に32x32で描画
		game.draw.drawImage(image, 16, 0, 16, 16, 320, 240, 32, 32);

		// 座標の位置に円を描く
		game.draw.fillStyle = '#ff0000'; // redでも良い
		game.draw.beginPath();
		game.draw.arc(position.x, position.y, 10, 0, Math.PI * 2);
		game.draw.fill();
		game.draw.closePath();

		// 現在のフレーム数を描画する
		game.draw.fillStyle = 'white';
		// 文字列を上を基準に描画する
		game.draw.textBaseline = 'top';
		// 上を基準に0, 0の位置から文字列を描画する
		game.draw.fillText(`Frame: ${frame}`, 0, 0);
	};

	// クリックイベントを登録
	game.onClick = (event) => {
		// クリック座標（スクリーン座標変換済み）を取得
		position.x = event.x;
		position.y = event.y;
	};

	// 停止ボタンをクリックしたら更新を止める
	document.getElementById('stop')?.addEventListener('click', () => {
		// 更新停止
		game.onUpdate = null;
	});
});*/
