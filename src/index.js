import PIXI from 'pixi.js';
//Aliases
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
let stage = new Container(),
    renderer = autoDetectRenderer(512, 512);
document.body.appendChild(renderer.view);

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Load an image and run the `setup` function when it's done
loader
  .add("images/treasureHunter.json")
  .load(setup);

//Define variables that might be used in more
//than one function
let dungeon, explorer, treasure, door, id;

function setup () {
	// The Dungeon
	let dungeonTexture = TextureCache['dungeon.png'];
	dungeon = new Sprite(dungeonTexture);
	stage.addChild(dungeon);

	// The Explorer
	explorer = new Sprite(
		resources['images/treasureHunter.json'].textures['explorer.png']
	);
	explorer.x = 68;
	explorer.y = stage.height / 2 - explorer.height / 2;
	stage.addChild(explorer);

	// The Treasure
	let id = PIXI.loader.resources['images/treasureHunter.json'].textures;
	treasure = new Sprite(id['treasure.png']);
	treasure.x = stage.width - treasure.width - 48;
	treasure.y = stage.height / 2 - treasure.height / 2;
	stage.addChild(treasure);

	// The Exit door
	door = new Sprite(id['door.png']);
	door.position.set(32, 0);
	stage.addChild(door);

	// The Blob Monsters

	let numberOfBlobs = 6;
	let spacing = 48;
	let xOffset = 150;

	for (let i = 0; i < numberOfBlobs; i++) {
		let blob = new Sprite(id['blob.png']);
		let x = spacing * i + xOffset;
		let y = randomInt(0, stage.height - blob.height);
		blob.x = x;
		blob.y = y;
		stage.addChild(blob);
	}

	// Render function
	renderer.render(stage);
}
