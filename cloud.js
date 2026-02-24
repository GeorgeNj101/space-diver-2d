class Cloud {
	constructor(game, x, y, baseSpeed) {
		this.game = game; // reference to game engine
		this.x = x;
		this.y = y;
		this.baseSpeed = baseSpeed; // kept for compatibility, but not used for motion now

		// Use cloud.png sprite, scaled down a bit
		this.scale = 0.15; // smaller clouds; tweak as needed
		const img = ASSET_MANAGER.getAsset("./assets/cloud.png");
		if (img) {
			this.width = img.width * this.scale;
			this.height = img.height * this.scale;
		} else {
			// fallback size if image not yet available
			this.width = 80;
			this.height = 40;
		}

		this.removeFromWorld = false;
	}

	update(dt) {
		// Clouds should not move independently; they ride with the world scroll.
		// So they move only at worldSpeed, matching the background.
		this.y += this.game.worldSpeed * dt;

		// remove once fully off bottom
		if (this.y > this.game.height) {
			this.removeFromWorld = true;
		}

		// Collision with player: rect vs rect (shrunk cloud hitbox for fairness)
		const player = this.game.entities.find((e) => e instanceof Player);
		if (player) {
			// Player hitbox (centered on player.x, player.y)
			const pHalfW = player.hitW / 2;
			const pHalfH = player.hitH / 2;
			const pLeft = player.x - pHalfW;
			const pRight = player.x + pHalfW;
			const pTop = player.y - pHalfH;
			const pBottom = player.y + pHalfH;

			// Cloud hitbox — shrink by 20% on each side for forgiving feel
			const pad = 0.58;
			const cLeft = this.x + this.width * pad;
			const cRight = this.x + this.width * (1 - pad);
			const cTop = this.y + this.height * pad;
			const cBottom = this.y + this.height * (1 - pad);

			// AABB overlap check
			if (pRight > cLeft && pLeft < cRight && pBottom > cTop && pTop < cBottom) {
				this.game.gameOver = true;
			}
		}
	}

	draw(ctx) {
		const img = ASSET_MANAGER.getAsset("./assets/cloud.png");
		if (img) {
			ctx.drawImage(img, this.x, this.y, this.width, this.height);
		} else {
			// fallback: simple rectangle if image missing
			ctx.fillStyle = "lightgray";
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
}
