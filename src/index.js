import PIXI from 'pixi.js';

//Aliases
let Container = PIXI.Container,
  autoDetectRenderer = PIXI.autoDetectRenderer,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
let stage = new Container(),
  renderer = autoDetectRenderer(512, 512);
document.body.appendChild(renderer.view);

//Set the canvas's border style and background color
renderer.view.style.border = "1px dashed black";
renderer.backgroundColor = "0xFFFFFF";

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );

  //Return the `key` object
  return key;
}


//load an image and run the `setup` function when it's done
loader
  .add("/images/pixie96x48.png").load(setup);

//Define any variables that are used in more than one function
let pixie;

let state = play;

function setup() {

  //Create the `pixie` sprite
  pixie = new Sprite(resources["/images/pixie96x48.png"].texture);

  pixie.x = 0;
  pixie.y = 0;
  pixie.vx = 0;
  pixie.vy = 0;

  //Add the sprite to the stage
  stage.addChild(pixie);

  let left = keyboard(37);
  let up = keyboard(38);
  let right = keyboard(39);
  let down = keyboard(40);

  left.press = () => {
    pixie.vx = -5;
    pixie.vy = 0;
  };

  left.release = () => {
    if (!right.isDown && pixie.vy === 0) {
      pixie.vx = 0;
    }
  };

  up.press = () => {
    pixie.vy = -5;
    pixie.vx = 0;
  };

  up.release = () => {
    if (!down.isDown && pixie.vx === 0) {
      pixie.vy = 0;
    }
  };

  right.press = () => {
    pixie.vx = 5;
    pixie.vy = 0;
  };

  right.release = () => {
    if (!up.isDown && pixie.vy === 0) {
      pixie.vx = 0;
    }
  };

  down.press = () => {
    pixie.vy = 5;
    pixie.vx = 0;
  };

  down.release = () => {
    if (!up.isDown && pixie.vx === 0) {
      pixie.vy = 0;
    }
  };

  //Start the game loop
  gameLoop();
}

function gameLoop(){

  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  state();
  //Render the stage
  renderer.render(stage);
}

function play() {
  pixie.x += pixie.vx;
  pixie.y += pixie.vy;
}
