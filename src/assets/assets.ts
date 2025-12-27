import { Image, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Image[] = [
	// Backgrounds
	image('backgrounds/background', 'background'),
	image('backgrounds/placeholderbkg', 'tempbkg'),
	image('backgrounds/upgradebkg', 'upgradebkg'),
	image('backgrounds/upgradeoverlay', 'upgradeoverlay'),
	image('backgrounds/bottombar', 'bottombar'),
	image('backgrounds/midbar', 'midbar'),
	image('backgrounds/topbar', 'topbar'),
	image('backgrounds/redlines', 'redlines'),

	// Characters
	image('characters/player', 'player'),

	// Items
	image('items/coin', 'coin'),

	// UI
	image('ui/hud', 'hud'),
	image('ui/panelred', 'panelred'),
	image('ui/aug_lock', 'aug_lock'),
	image('ui/aug_select_back', 'aug_select_back'),
	

	// Titlescreen
	image('titlescreen/sky', 'title_sky'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/character', 'title_character'),

	image('characters/turretbase', 'turretbase'),
	image('characters/gungun', 'gungun'),
	image('characters/heart', 'heart'),
	image('characters/pbullet', 'pbullet'),

	// Weapons
	image('weapons/gun_0', 'gun_0'),
	image('weapons/gun_1', 'gun_1'),
	image('weapons/gun_2', 'gun_2'),
	image('weapons/gun_3', 'gun_3'),
	image('weapons/gun_4', 'gun_4'),
	image('weapons/gun_7', 'gun_7'),
	image('weapons/aug_0', 'aug_0'),
	image('weapons/aug_1', 'aug_1'),
	image('weapons/aug_2', 'aug_2'),
	image('weapons/aug_3', 'aug_3'),
	image('weapons/aug_4', 'aug_4'),
	image('weapons/aug_5', 'aug_5'),
	image('weapons/aug_6', 'aug_6'),
	image('weapons/aug_7', 'aug_7'),
	image('weapons/aug_8', 'aug_8'),
	image('weapons/aug_9', 'aug_9'),
	image('weapons/aug_10', 'aug_10'),
	image('weapons/aug_11', 'aug_11'),
	image('weapons/aug_12', 'aug_12'),
	image('weapons/aug_13', 'aug_13'),
	image('weapons/aug_14', 'aug_14'),
	image('weapons/aug_15', 'aug_15'),
	image('weapons/aug_16', 'aug_16'),
	image('weapons/aug_17', 'aug_17'),
	image('weapons/aug_18', 'aug_18'),
	image('weapons/equip', 'equip'),
	image('weapons/gunback', 'gunback'),
	image('weapons/blank', 'blank'),
	image('weapons/stackcircle', 'stackcircle'),

	// Enemies
	image('enemies/enemy_1', 'enemy_1'),
	image('enemies/fragments/e1/f1-0', 'f1-0'),
	image('enemies/fragments/e1/f1-1', 'f1-1'),
	image('enemies/fragments/e1/f1-2', 'f1-2'),
	image('enemies/fragments/e1/f1-3', 'f1-3'),
	image('enemies/fragments/e1/f1-4', 'f1-4'),
	image('enemies/fragments/e1/f1-5', 'f1-5'),
	image('enemies/fragments/e1/f1-6', 'f1-6'),
	image('enemies/fragments/e1/f1-7', 'f1-7'),
	image('enemies/fragments/e1/f1-8', 'f1-8'),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("anims/splash", "splash", 64, 64),
	spritesheet("anims/hit_spark", "hit_spark", 128, 128),

	spritesheet("ui/aug", "aug", 48, 64),
	spritesheet("ui/aug_extra", "aug_extra", 48, 64),
	spritesheet("ui/aug_button_frame", "aug_button_frame", 64, 64),
	spritesheet("ui/aug_button_back", "aug_button_back", 64, 64),

	spritesheet("ui/aug_select_frame", "aug_select_frame", 200, 200),
];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('tree/rustle', 't_rustle', 0.5),
	sound('enemies/oof', 'oof', 0.5),
	sound('enemies/dead', 'dead', 0.5),
	sound('ui/shift', 'shift', 0.5),
	sound('weapons/machinegun', 'machinegun', 0.5),

	sound('weapons/gun_0', 'gun_0', 0.5),
	sound('weapons/gun_1', 'gun_1', 0.5),
	sound('weapons/gun_3', 'gun_3', 0.5),
	sound('weapons/gun_4', 'gun_4', 0.5),
	sound('weapons/gun_7', 'gun_7', 0.5),
	sound('weapons/equip', 'equip', 0.5),

	sound('weapons/start_reload', 'start_reload', 0.5),
	sound('weapons/end_reload', 'end_reload', 0.5),
	sound('weapons/stackexplode', 'stackexplode', 0.5),
];

/* Fonts */
await loadFont('Sketch', 'Game Font');

export {
	images,
	spritesheets,
	audios
};