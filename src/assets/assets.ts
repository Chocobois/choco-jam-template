/* Font */
import GameFont from './fonts/DynaPuff-Medium.ttf';

/* Interfaces */
interface Asset {
	key: string;
	path: string;
}

interface SpriteSheet {
	key: string;
	path: string;
	width: number;
	height: number;
}

interface Audio {
	key: string;
	path: string;
	volume?: number;
	rate?: number;
}

/* Images */
// Titlescreen
import title_foreground from "./images/titlescreen/foreground.png";
import title_background from "./images/titlescreen/background.png";
import title_skybackground from "./images/titlescreen/skybackground.png";

const images: Asset[] = [
	// Titlescreen
	{ key: "title_foreground", path: title_foreground },
	{ key: "title_background", path: title_background },
	{ key: "title_skybackground", path: title_skybackground }
];


/* Spritesheets */
const spritesheets: SpriteSheet[] = [
];

/* Audio */
// UI
import m_main_menu from "./music/title.mp3";

// Music
import m_first from "./music/first.mp3";

// SFX: Tree
import t_rustle from "./sounds/tree/rustle.mp3";

const audios: Audio[] = [
	{ key: "m_main_menu", path: m_main_menu },
	{ key: "m_first", path: m_first },
	{ key: "t_rustle", path: t_rustle, volume: 0.5 }
];

const face = new FontFace('Game Font', `url(${GameFont})`, {style: 'normal', weight: '400'});
await face.load();
document.fonts.add(face);

export {
	images,
	spritesheets,
	audios
};