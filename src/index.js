import PIXI from 'pixi.js';

//Aliases
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    Texture = PIXI.Texture,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
let stage = new Container(),
    renderer = autoDetectRenderer(256, 256);
document.body.appendChild(renderer.view);

//Set the canvas's border style and background color
renderer.view.style.border = "1px dashed black";
renderer.backgroundColor = "0xFFFFFF";

function frame(source, x, y, width, height) {
  let texture;
  let imageFrame;

  if (typeof source == 'string') {
    if (TextureCache[source]) {
      texture = new Texture(TextureCache[source]);
    }
  } else if (source instanceof Texture) {
    texture = new Texture(source);
  } if (!texture) {
    console.log(`Please load the ${source} texture into cache.`)
  } else {
    imageFrame = new Rectangle(x, y, width, height);
    texture.frame = imageFrame;
    return texture;
  }
}

loader
  .add('/images/tileset.png')
  .load(setup);

function setup () {
  let adventuress = new Sprite(frame('/images/tileset.png', 160, 256, 32, 32))
  adventuress.x = 64;
  adventuress.y = 64;
  adventuress.scale.set(3, 3);
  stage.addChild(adventuress);
  renderer.render(stage);
}
