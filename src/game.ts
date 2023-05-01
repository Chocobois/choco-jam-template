import Phaser from 'phaser';
import { PreloadScene } from "@/scenes/PreloadScene";
import { TitleScene } from "@/scenes/TitleScene";
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 1920/4,
	height: 1080/4,
	// mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
	mipmapFilter: 'NEAREST',
	pixelArt: true,
	antialias: false,
	scale: {
		mode: Phaser.Scale.FIT
	},
	scene: [
		PreloadScene,
		TitleScene
	],

	plugins: {
		global: [{
			key: 'rexOutlinePipeline',
			plugin: OutlinePipelinePlugin,
			start: true
		}]
	}
};

const game = new Phaser.Game(config);
