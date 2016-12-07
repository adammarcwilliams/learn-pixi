import PIXI from 'pixi.js';
import scaleToWindow from './helpers/scaleToWindow.js'

let renderer = PIXI.autoDetectRenderer(256, 256);

document.body.appendChild(renderer.view);

let stage = new PIXI.Container();

renderer.backgroundColor = 0xfff666;
renderer.resize(512, 512);
renderer.view.style.border = '1px dashed black';
renderer.view.style.position = 'absolute';
renderer.view.style.width = window.innerWidth + 'px';
renderer.view.style.height = window.innerHeight + 'px';
renderer.view.style.display = 'block';

window.addEventListener('resize', e => {
	scaleToWindow(renderer.view, 0xfff666)
})

renderer.render(stage);
