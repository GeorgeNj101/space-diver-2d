class GameEngine {
	constructor(width, height) {
		this.ctx = null;
		this.width = width;
		this.height = height;
		this.entities = [];
		this.clockTick = null;
		this.timer = null;
		this.keys = {};
		this.worldSpeed = 100;
		this.difficulty = 5;
		this.cloudSpawnTimer = 0;
		this.cloudSpawnRate = 0.8;
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
		// this.timer = new Timer();

		window.addEventListener("keydown", (e) => {
			this.keys[e.key] = true;
		});

		window.addEventListener("keyup", (e) => {
			this.keys[e.key] = false;
		});
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
		const x = Math.random() * (this.width - 80);
		const y = -50; // just above the screen
		const speed = 40 + Math.random() * 40;
	
		this.addEntity(new Cloud(this, x, y, speed));
	}

	update(dt) {
		this.worldSpeed += this.difficulty * dt; // increase world speed over time

		this.updateSpawns(dt);

		let entitiesCount = this.entities.length;
		for (let i = 0; i < entitiesCount; i++) {
			this.entities[i].update(dt);
		}
		this.entities = this.entities.filter((entity) => !entity.removeFromWorld);
	}

	draw(ctx) {
		ctx.clearRect(0, 0, this.width, this.height);
		let entitiesCount = this.entities.length;
		for (let i = 0; i < entitiesCount; i++) {
			this.entities[i].draw(ctx);
		}
	}

	loop(dt) {
		// this.clockTick = this.timer.tick();
		// this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.update(dt);
		this.draw(this.ctx);
	}

}