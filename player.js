class Player {
	constructor(game) {
		this.game = game;

		this.x = game.width / 2;
		this.y = game.height * 0.65;

		this.speedX = 0;
		this.maxSpeed = 250;

		// Visual sprite scaling
		this.scaleX = 0.15;
		this.scaleY = 0.08;

		// Compute actual hitbox from sprite dimensions (updated once image loads)
		const img = ASSET_MANAGER.getAsset("./assets/space_diver_1.png");
		if (img) {
			this.hitW = img.width * this.scaleX * 0.6;  // shrink for forgiving feel
			this.hitH = img.height * this.scaleY * 0.6;
		} else {
			this.hitW = 20;
			this.hitH = 20;
		}
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

		// keep player inside screen using half hitbox width
		const halfW = this.hitW / 2;
		if (this.x - halfW < 0) this.x = halfW;
		if (this.x + halfW > this.game.width)
			this.x = this.game.width - halfW;
	}

	draw(ctx) {
		const img = ASSET_MANAGER.getAsset("./assets/space_diver_1.png");
		if (!img) return;

		const drawW = img.width * this.scaleX;
		const drawH = img.height * this.scaleY;
		const halfW = drawW / 2;
		const halfH = drawH / 2;
		// draw so that (this.x, this.y) is the center of the diver sprite
		ctx.drawImage(img, this.x - halfW, this.y - halfH, drawW, drawH);
	}
}
