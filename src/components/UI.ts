import { GameScene } from "@/scenes/GameScene";
import { score } from "@/state/ClickState";
import { autorun } from "mobx";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;
	private text2: Phaser.GameObjects.Text;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelHeight = 200;

		this.panel = this.scene.add.container(0, 0);
		this.add(this.panel);

		this.background = this.scene.add.image(0, 0, "hud");
		this.background.setScale(panelHeight / this.background.height);
		this.panel.add(this.background);

		this.text = this.scene.addText({
			x: -50,
			y: 0,
			size: 60,
			color: "#FFFFFF",
			text: "Score: 0",
		});
		this.text.setStroke("black", 4);
		this.text.setOrigin(0, 0.5);
		this.panel.add(this.text);

		this.text2 = this.scene.addText({
			x: -50,
			y: -80,
			size: 60,
			color: "#FFFFFF",
			text: "Spam: 0",
		});
		this.text2.setStroke("black", 4);
		this.text2.setOrigin(0, 0.5);
		this.panel.add(this.text2);

		this.panel.setPosition(
			this.scene.W - this.background.displayWidth / 2 - 30,
			this.scene.H - this.background.displayHeight / 2 - 30
		);

		autorun(() => {
			this.text.text = `Score: ${score.clicks}`;
		});

		autorun(() => {
			this.text2.text = `Spam: ${score.spammedClicks}`;
		});
	}

	update(time: number, delta: number) {}
}
