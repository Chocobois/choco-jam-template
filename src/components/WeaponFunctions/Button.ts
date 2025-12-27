import { BaseScene } from "@/scenes/BaseScene";

export class Button extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	// private hover: boolean;
	private _hold: boolean;
	protected blocked: boolean;
	public liftSmooth: number;
	public holdSmooth: number;
	public category: number;


	private tween: Phaser.Tweens.Tween;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);


		// this.hover = false;
		this._hold = false;
		this.blocked = false;

		this.liftSmooth = 0;
		this.holdSmooth = 0;
	}

	bindInteractive(
		gameObject: Phaser.GameObjects.GameObject,
		draggable = false
	) {
		gameObject.removeInteractive();
		gameObject
			.setInteractive({ useHandCursor: true, draggable: draggable })
			.on("pointerout", this.onOut, this)
			.on("pointerover", this.onOver, this)
			.on("pointerdown", this.onDown, this)
			.on("pointerup", this.onUp, this)
			.on("dragstart", this.onDragStart, this)
			.on("drag", this.onDrag, this)
			.on("dragend", this.onDragEnd, this);
		return gameObject;
	}

	public get hold(): boolean {
		return this._hold;
	}

	set hold(value: boolean) {
		if (value != this._hold) {
			if (this.tween) {
				this.tween.stop();
			}
			if (value) {
				this.tween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 0.0, to: 1.0 },
					ease: "Cubic.Out",
					duration: 100,
				});
			} else {
				this.tween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 1.0, to: 0.0 },
					ease: (v: number) => {
						return Phaser.Math.Easing.Elastic.Out(v, 1.5, 0.5);
					},
					duration: 400,
				});
			}
		}

		this._hold = value;
	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		// this.hover = false;
		if (this.hold) this.emit("up");
		this.hold = false;
	}

	onOver(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		// this.hover = true;
	}

	onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		if (!this.hold) this.emit("down");
		this.hold = true;
		this.blocked = false;
	}

	onUp(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		if (this.hold && !this.blocked) {
			this.emit("click");
		}
		if (this.hold) this.emit("up");
		this.hold = false;
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		// this.hold = false;
		// if (Math.abs(dragY) > 8) {
		// 	this.hold = false;
		// }
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	isInsidePlayingField(): boolean {
		return false;
	}

	block() {
		this.blocked = true;
	}
}
