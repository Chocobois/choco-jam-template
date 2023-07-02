import { BaseScene } from "./BaseScene";
import { Music } from "@/components/Music";

import { version } from "@/version.json";

const creditsLeft = `Game Jam Template 

@Golenchu
@ArcticFqx
HeXaGoN
@LuxxArt
@MatoCookies
Lumie
@Dreedawott
Frassy
Luxi`;

const creditsRight = `

code
code
code
art
music & code
art & code
art
ideas
testing`;


export class TitleScene extends BaseScene {
	public skybackground: Phaser.GameObjects.Image;
	public background: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;

	public credits: Phaser.GameObjects.Container;
	public title: Phaser.GameObjects.Text;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public isStarting: boolean;


	constructor() {
		super({key: "TitleScene"});
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.skybackground = this.add.image(this.CX, this.CY, "title_skybackground");
		this.containToScreen(this.skybackground);
		this.background = this.add.image(this.CX, 0.9*this.CY, "title_background");
		this.containToScreen(this.background);
		this.foreground = this.add.image(this.CX, this.CY, "title_foreground");
		this.containToScreen(this.foreground);

		this.background.setVisible(false);
		this.background.setAlpha(0);
		this.background.y += 4*1000*this.SCALE;
		this.foreground.y += 4*250*this.SCALE;


		this.title = this.createText(0.25*this.W, 0.7*this.H, 160*this.SCALE, "#000", "Game Title");
		this.title.setOrigin(0.5);
		this.title.setStroke("#FFF", 40*8*this.SCALE);
		this.title.setPadding(2*40*8*this.SCALE);
		this.title.setVisible(false);
		this.title.setAlpha(0);

		this.subtitle = this.createText(0.25*this.W, 0.87*this.H, 120*this.SCALE, "#000", "Tap to start");
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke("#FFF", 40*3*this.SCALE);
		this.subtitle.setPadding(2*40*2*this.SCALE);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);

		this.tap = this.createText(this.CX, this.CY, 4*35*this.SCALE, "#000", "Tap to focus");
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 40*4*this.SCALE);
		this.tap.setPadding(2*40*4*this.SCALE);

		this.version = this.createText(this.W, this.H, 40*this.SCALE, "#000", version);
		this.version.setOrigin(1, 1);
		this.version.setAlpha(-1);
		this.version.setStroke("#FFF", 10*4*this.SCALE);
		this.version.setPadding(2*40*4*this.SCALE);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.createText(0.6*this.W, 4*this.SCALE, 50*this.SCALE, "#c2185b", creditsLeft);
		credits1.setStroke("#FFF", 100*this.SCALE);
		credits1.setPadding(2*100*this.SCALE);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.createText(0.8*this.W, 4*this.SCALE, 50*this.SCALE, "#c2185b", creditsRight);
		credits2.setStroke("#FFF", 100*this.SCALE);
		credits2.setPadding(2*100*this.SCALE);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);


		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_first", { volume: 0.4 });
			this.musicTitle.on('bar', this.onBar, this);
			this.musicTitle.on('beat', this.onBeat, this);

			// this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;

		}
		this.musicTitle.play();


		// Input

		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', this.progress, this);
		this.input.on('pointerdown', (pointer: PointerEvent) => {
			if (pointer.button == 0) {
				this.progress();
			}
		}, this);
		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.background.visible) {
			this.background.y		+= 0.02 * (this.CY - this.background.y);
			this.foreground.y		+= 0.025 * (this.CY - this.foreground.y);

			this.background.alpha += 0.03 * (1 - this.background.alpha);

			this.title.alpha += 0.02 * ((this.title.visible ? 1 : 0) - this.title.alpha);
			this.subtitle.alpha += 0.02 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);
			this.version.alpha += 0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		}
		else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);

			if (this.musicTitle.seek > 0) {
				this.background.setVisible(true);
				this.tap.setVisible(false);
			}
		}


		this.subtitle.setScale(0.1 + 0.002*Math.sin(5*time/1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4*Math.sin(50*time/1000));
		}
	}

	progress() {
		if (!this.background.visible) {
			this.onBar(1);
		}
		else if (!this.subtitle.visible) {
			this.title.setVisible(true);
			this.title.setAlpha(1);
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		}

		else if (!this.isStarting) {
			this.sound.play("t_rustle", { volume: 0.3 });
			// this.sound.play("m_slice", { volume: 0.3 });
			// this.sound.play("u_attack_button", { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xFFFFFF, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
					// this.musicTitle.stop();
					// this.scene.start("GameScene", { titleMusic: this.musicTitle });
				});
			});
		}
	}


	onBar(bar: number) {
		if (bar >= 2) {
			this.title.setVisible(true);
		}
		if (bar >= 4) {
			this.subtitle.setVisible(true);
			this.credits.setVisible(true);
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}