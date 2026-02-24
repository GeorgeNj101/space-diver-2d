class GameEngine {
	constructor(width, height) {
		this.ctx = null;
		this.width = width;
		this.height = height;
		this.entities = [];
		this.clockTick = null;
		this.timer = null;
		this.keys = {};
		this.gameOver = false;
		this.resetDefaults();
	}

	resetDefaults() {
		this.worldSpeed = 100;
		this.difficulty = 5;
		this.cloudSpawnTimer = 0;
		this.cloudSpawnRate = 1.5;
		this.bgOffsetY = 0;
		this.lastCloudCenterX = this.width / 2;
	}

	updateSpawns(dt) {
		this.cloudSpawnTimer += dt;
		
		if (this.cloudSpawnTimer >= this.cloudSpawnRate) {
			this.spawnCloud();
			this.cloudSpawnTimer = 0;
		}
	}
	init(ctx) {
		this.ctx = ctx;

		window.addEventListener("keydown", (e) => {
			this.keys[e.key] = true;

			// Restart on Space when game is over
			if (e.key === " " && this.gameOver) {
				this.restart();
			}
		});

		window.addEventListener("keyup", (e) => {
			this.keys[e.key] = false;
		});
	}

	restart() {
		// Clear all entities and re-add a fresh player
		this.entities = [];
		this.gameOver = false;
		this.resetDefaults();

		const player = new Player(this);
		this.addEntity(player);
		// Loop is still running, no need to call start() again
	}
	start() {
		this.running = true;
		this.lastTime = 0;
		const gameLoop = (timestamp) => {
			if (!this.lastTime) this.lastTime = timestamp;
			const dt = (timestamp - this.lastTime) / 1000;
			this.lastTime = timestamp;

			this.loop(dt);
			if (this.running) {
				requestAnimationFrame(gameLoop);
			}
		};
		
		requestAnimationFrame(gameLoop);
	}

	addEntity(entity) {
		this.entities.push(entity);
	}

	spawnCloud() {
		// Use relative X so clouds form a continuous, doable path.
		const cloudImg = ASSET_MANAGER.getAsset("./assets/cloud.png");
		const scale = 0.15; // must match Cloud.scale
		let cloudWidth = 80;
		let cloudHeight = 40;
		if (cloudImg) {
			cloudWidth = cloudImg.width * scale;
			cloudHeight = cloudImg.height * scale;
		}
		const halfWidth = cloudWidth / 2;
		const maxStep = 200; // max horizontal change per cloud
		const minStep = 60;  // minimum horizontal change so they don't line up

		// pick new center near previous center, but force a minimum offset
		const rand = Math.random() * 2 - 1; // -1 .. 1
		const sign = rand >= 0 ? 1 : -1;
		const step = minStep + Math.random() * (maxStep - minStep);
		let centerX = this.lastCloudCenterX + sign * step;
		// keep whole cloud on screen
		centerX = Math.max(halfWidth, Math.min(centerX, this.width - halfWidth));
		this.lastCloudCenterX = centerX;

		const x = centerX - halfWidth;
		const y = -cloudHeight - 10; // fully above the screen
		const speed = 0;

		this.addEntity(new Cloud(this, x, y, speed));
	}

	update(dt) {
		if (this.gameOver) return; // freeze game logic when dead

		this.worldSpeed += this.difficulty * dt;
		this.bgOffsetY += this.worldSpeed * dt;

		this.updateSpawns(dt);

		let entitiesCount = this.entities.length;
		for (let i = 0; i < entitiesCount; i++) {
			this.entities[i].update(dt);
		}
		this.entities = this.entities.filter((entity) => !entity.removeFromWorld);
	}

	draw(ctx) {
		ctx.clearRect(0, 0, this.width, this.height);
		// Draw scrolling tiled background first
		const bg = ASSET_MANAGER.getAsset("./assets/world.png");
		if (bg) {
			const imgW = bg.width;
			const imgH = bg.height;
				// keep offset in [0, imgH) and scroll background downward
				const offsetY = this.bgOffsetY % imgH;
				let startY = offsetY - imgH; // as offset grows, tiles move down
			while (startY < this.height) {
				for (let x = 0; x < this.width; x += imgW) {
					ctx.drawImage(bg, x, startY);
				}
				startY += imgH;
			}
		}
		let entitiesCount = this.entities.length;
		for (let i = 0; i < entitiesCount; i++) {
			this.entities[i].draw(ctx);
		}

		// Game Over overlay
		if (this.gameOver) {
			// Dim the screen
			ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx.fillRect(0, 0, this.width, this.height);

			// "GAME OVER" text
			ctx.fillStyle = "#ff4444";
			ctx.font = "bold 64px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("GAME OVER", this.width / 2, this.height / 2 - 40);

			// "Press SPACE to restart" text
			ctx.fillStyle = "#ffffff";
			ctx.font = "24px Arial";
			ctx.fillText("Press SPACE to restart", this.width / 2, this.height / 2 + 30);
		}
	}

	loop(dt) {
		// this.clockTick = this.timer.tick();
		// this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.update(dt);
		this.draw(this.ctx);
	}

}