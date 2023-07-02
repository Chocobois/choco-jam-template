import { Asset, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Asset[] = [
	// Titlescreen
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/skybackground', 'title_skybackground')
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [

];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('tree/rustle', 't_rustle', 0.5),
];

await loadFont('DynaPuff-Medium', 'Game Font');

export {
	images,
	spritesheets,
	audios
};