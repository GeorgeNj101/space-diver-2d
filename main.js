const ASSET_MANAGER = new AssetManager();

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const gameEngine = new GameEngine(GAME_WIDTH, GAME_HEIGHT);


ASSET_MANAGER.queueDownload("./assets/space_diver_1.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	canvas.width = GAME_WIDTH;
	canvas.height = GAME_HEIGHT;

	gameEngine.init(canvas.getContext("2d"));	

	const player = new Player(gameEngine);
	gameEngine.addEntity(player);

	gameEngine.start();
});