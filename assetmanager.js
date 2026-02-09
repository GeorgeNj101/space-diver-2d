class AssetManager {
	constructor() {
		this.ready = false;
		this.successCount = 0;
		this.errorCount = 0;
		this.cache = [];
		this.downloadQueue = [];
		this.sounds = [];
	}

	queueDownload(imageSrc) {
		this.downloadQueue.push(imageSrc);
	}

	isDone() {
		return this.downloadQueue.length === this.successCount + this.errorCount;
	}

	downloadAll(callback) {
		if (this.downloadQueue.length === 0) {
			callback();
			return;
		}

		for (let i = 0; i < this.downloadQueue.length; i++) {
			const img = new Image();
			const that = this;

			img.addEventListener("load", function () {
				that.successCount++;
				if (that.isDone()) callback();
			});

			img.addEventListener("error", function () {
				that.errorCount++;
				if (that.isDone()) callback();
			});

			img.src = this.downloadQueue[i];
			this.cache[this.downloadQueue[i]] = img;
		}
	}

	getAsset(path) {
		return this.cache[path];
	}
}

// // requestAnimationFrame polyfill
// window.requestAnimFrame = (function () {
// 	return window.requestAnimationFrame ||
// 		window.webkitRequestAnimationFrame ||
// 		window.mozRequestAnimationFrame ||
// 		window.oRequestAnimationFrame ||
// 		window.msRequestAnimationFrame ||
// 		function (callback) {
// 			window.setTimeout(callback, 1000 / 60);
// 		};
// })();