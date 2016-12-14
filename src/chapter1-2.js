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

function contain(sprite, container) {
  let collision = new Set();

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision.add('left')
  }
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision.add('top')
  }
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision.add('right');
  }
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision.add('bottom');
  }
  if (collision.size === 0) collision = undefined;

  return collision;
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
  pixie.accelerationX = 0;
  pixie.accelerationY = 0;
  pixie.frictionX = 1;
  pixie.frictionY = 1;
  pixie.speed = 0.2;
  pixie.drag = 0.98;

  //Add the sprite to the stage
  stage.addChild(pixie);

  let left = keyboard(37);
  let up = keyboard(38);
  let right = keyboard(39);
  let down = keyboard(40);

  left.press = () => {
    pixie.accelerationX = -pixie.speed;
    pixie.frictionX = 1;
  };

  left.release = () => {
    if (!right.isDown) {
      pixie.accelerationX = 0;
      pixie.frictionX = pixie.drag;
    }
  };

  up.press = () => {
    pixie.accelerationY = -pixie.speed;
    pixie.frictionY = 1;
  };

  up.release = () => {
    if (!down.isDown) {
      pixie.accelerationY = 0;
      pixie.frictionY = pixie.drag;
    }
  };

  right.press = () => {
    pixie.accelerationX = pixie.speed;
    pixie.frictionX = 1;
  };

  right.release = () => {
    if (!up.isDown) {
      pixie.accelerationX = 0;
      pixie.frictionX = pixie.drag;
    }
  };

  down.press = () => {
    pixie.accelerationY = pixie.speed;
    pixie.frictionY = 1;
  };

  down.release = () => {
    if (!up.isDown) {
      pixie.accelerationY = 0;
      pixie.frictionY = pixie.drag;
    }
  };

  // Start the game loop
  gameLoop();
}

function gameLoop () {
  // Loop this function 60 times per second
  window.requestAnimationFrame(gameLoop);
  state();
  // Render the stage
  renderer.render(stage);
}

function play () {
  pixie.vx += pixie.accelerationX;
  pixie.vy += pixie.accelerationY;

  pixie.vx *= pixie.frictionX;
  pixie.vy *= pixie.frictionY;

  pixie.vy += 0.1;

  pixie.x += pixie.vx;
  pixie.y += pixie.vy;

  let collision = contain(
    pixie,
    {
      x: 0,
      y: 0,
      width: renderer.view.width,
      height: renderer.view.height
    }
  );

  if (collision) {
    if (collision.has('left') || collision.has('right')) {
      pixie.vx = -pixie.vx;
    }
    if (collision.has('top') || collision.has('bottom')) {
      pixie.vy = -pixie.vy;
    }
  }
}
