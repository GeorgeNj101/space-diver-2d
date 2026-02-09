class Cloud {
	constructor(game, x, y, baseSpeed) {
		this.game = game; // reference to game engine
		this.x = x;
		this.y = y;
		this.baseSpeed = baseSpeed;

		this.width = 80;
		this.height = 40;

		this.removeFromWorld = false;
	}

	update(dt) {
		this.speed = this.baseSpeed + this.game.worldSpeed;
		this.y += this.speed * dt;

		// remove once fully off bottom
		if (this.y > this.game.height) {
			this.removeFromWorld = true;
		}
	}

	draw(ctx) {
		ctx.fillStyle = "lightgray";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}
