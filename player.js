class Player {
	constructor(game) {
		this.radius = 20;
		this.game = game;

		this.x = game.width / 2;
		this.y = game.height * 0.65;

		this.speedX = 0;
		this.maxSpeed = 250;
	}

	update(dt) {
		const keys = this.game.keys;
		this.speedX = 0; // reset each frame so we only move while keys are held
		if (keys["ArrowLeft"] || keys["a"]) {
			this.speedX = -this.maxSpeed;
		}
		if (keys["ArrowRight"] || keys["d"]) {
			this.speedX = this.maxSpeed;
		}

		this.x += this.speedX * dt;

		// keep player inside screen
		if (this.x - this.radius < 0) this.x = this.radius;
		if (this.x + this.radius > this.game.width)
			this.x = this.game.width - this.radius;
	}

	draw(ctx) {
		const img = ASSET_MANAGER.getAsset("./assets/space_diver_1.png");
		if (!img) return; // safety: image not loaded

		// Non-uniform scaling: keep a decent width but squash the height
		// so the diver doesn't look so tall on screen.
		const scaleX = 0.15; // horizontal scale
		const scaleY = 0.08; // vertical scale (smaller to reduce length)
		const drawW = img.width * scaleX;
		const drawH = img.height * scaleY;
		const halfW = drawW / 2;
		const halfH = drawH / 2;
		// draw so that (this.x, this.y) is roughly the center of the diver sprite
		ctx.drawImage(img, this.x - halfW, this.y - halfH, drawW, drawH);
	}
}
