import { GameScene } from "@/scenes/GameScene";
import { WeaponDisplay } from "./WeaponDisplay";
import { Bullet } from "./WeaponFunctions/Bullet";
import { Weapon } from "./WeaponFunctions/Weapon";

const ACCELERATION = 250;
const MAX_SPEED = 400;
const FRICTION = 0.7;
const TAPPING_TIMER = 200; // ms
console.assert(
	ACCELERATION / (1 - FRICTION) >= MAX_SPEED,
	"Max speed unreachable"
);

//
//

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;
	private inventory: number;
	private tween: Phaser.Tweens.Tween;

	// Controls
	private keyboard: any;
	public isTouched: boolean;
	public isTapped: boolean;
	private tappedTimer: number;
	private inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	private touchPos: Phaser.Math.Vector2;
	public velocity: Phaser.Math.Vector2;
	public radius: number = 100;
	private border: { [key: string]: number };
	private hbox: Phaser.GameObjects.Sprite;
	private wpDisp: WeaponDisplay;
	private ttText: Phaser.GameObjects.Text;
	private fRad: number = 144;
	private firing: boolean = false;
	private cd: number = 0;
	private maxCD: number = 250;
	private gfx: Phaser.GameObjects.Graphics;

	public loadout: [Weapon,Weapon,Weapon];
	public activeWeapon: number = 0;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "turretbase");
		this.hbox = this.scene.add.sprite(0, 0, "heart");
		this.sprite.setOrigin(0.5, 0.5);
		this.hbox.setOrigin(0.5, 0.5);
		//this.sprite.y += this.spriteSize / 2;
		//this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);
		this.add(this.hbox);
		this.wpDisp = new WeaponDisplay(scene,0,0,this);
		this.add(this.wpDisp);
		this.wpDisp.setDepth(10);
		this.gfx = this.scene.add.graphics();
		this.add(this.gfx);
		this.gfx.setDepth(15);

		this.ttText = this.scene.addText({
			x: 0,
			y: -160,
			size: 40,
			color: "#FFFFFF",
			text: "",
		});
		this.ttText.setOrigin(0.5,0.5);
		this.add(this.ttText);

		/* Controls */
		if (this.scene.input.keyboard) {
			this.keyboard = this.scene.input.keyboard.addKeys({
				up1: "W",
				down1: "S",
				left1: "A",
				right1: "D",
				up2: "Up",
				down2: "Down",
				left2: "Left",
				right2: "Right",
				scrollback: "Q",
				scrollforward: "E",
				tracer: "T",
				cleartracer: "T",
			});
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
				.on("down", this.doABarrelRoll, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.E)
				.on("down", this.scrollForward, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
				.on("down", this.scrollBackward, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.T)
				.on("down", this.toggleTracer, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
				.on("down", this.clearTracer, this);
		}
		this.isTouched = false;
		this.isTapped = false;
		this.tappedTimer = 0;
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.touchPos = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: -1920,
			right: 1920,
			top: -1080,
			bottom: 1080,
		};
	}

	setDefaultLoadout(){
		this.loadout = [
			new Weapon(this.scene, this.scene.handler.getParams(0)),
			new Weapon(this.scene, this.scene.handler.getParams(1)),
			new Weapon(this.scene, this.scene.handler.getParams(7)),
		]
	}

	fetchLoadout(){
		//this.loadout[0] = new Weapon (this.scene, this.scene.masterData.)
	}

	update(time: number, delta: number) {

		this.gfx.clear();
		/*
		this.gfx.fillStyle(0x00FFFF,0.75);
		this.gfx.beginPath();
		this.gfx.slice(0,0,100,0,360,false,0.005);
		this.gfx.closePath();
		this.gfx.fillPath();
		*/

		this.ttText.setText("Position: " + this.x + ", " + this.y );

        const pointer = this.scene.input.activePointer;
        const worldX = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y).x;
        const worldY = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y).y;
		let a = Math.atan2((worldY-this.y),(worldX-this.x));
		this.wpDisp.update(time,delta,a);
		// Movement
		this.handleInput();

		if(this.cd > 0){
			this.cd -= delta;
			if(this.cd <= 0){
				this.cd = 0;
			}
		}
		if((this.loadout.length > 0)) {
			this.loadout[this.activeWeapon].update(time,delta);
		}
		if(this.firing) {
			this.scene.handler.shoot(a,this.getActiveWeapon());
				/*
				ofs = Phaser.Math.DegToRad(-25+(Math.random()*50));
				this.scene.addBullet(new Bullet(this.scene,this.x+(this.fRad*Math.cos(a)), this.y+(this.fRad*Math.sin(a)),10000,a+ofs));
				ofs = Phaser.Math.DegToRad(-25+(Math.random()*50));
				this.scene.addBullet(new Bullet(this.scene,this.x+(this.fRad*Math.cos(a)), this.y+(this.fRad*Math.sin(a)),10000,a+ofs));
				ofs = Phaser.Math.DegToRad(-25+(Math.random()*50));
				this.scene.addBullet(new Bullet(this.scene,this.x+(this.fRad*Math.cos(a)), this.y+(this.fRad*Math.sin(a)),10000,a+ofs));
				ofs = Phaser.Math.DegToRad(-25+(Math.random()*50));
				this.scene.addBullet(new Bullet(this.scene,this.x+(this.fRad*Math.cos(a)), this.y+(this.fRad*Math.sin(a)),10000,a+ofs));
				ofs = Phaser.Math.DegToRad(-25+(Math.random()*50));
				this.scene.addBullet(new Bullet(this.scene,this.x+(this.fRad*Math.cos(a)), this.y+(this.fRad*Math.sin(a)),10000,a+ofs));
				ofs = Phaser.Math.DegToRad(-25+(Math.random()*50));
				this.scene.addBullet(new Bullet(this.scene,this.x+(this.fRad*Math.cos(a)), this.y+(this.fRad*Math.sin(a)),10000,a+ofs));

				*/
		}

		this.inputVec.limit(1);
		// this.inputVec.normalize();
		this.inputVec.scale(ACCELERATION);

		if(!((this.inputVec.x == 0) && (this.inputVec.y == 0))){
			this.sprite.setAngle((180/Math.PI)*Math.atan2(this.inputVec.y,this.inputVec.x));
		}

		if (this.isTapped) {
			this.tappedTimer -= delta;
			if (this.tappedTimer <= 0) {
				this.isTapped = false;
			}
		} else {
			this.velocity.scale(FRICTION);
			this.velocity.add(this.inputVec);
			this.velocity.limit(MAX_SPEED);
		}

		this.x += (this.velocity.x * delta) / 1000;
		this.y += (this.velocity.y * delta) / 1000;

		// Border collision
		this.checkBounds();

		// Animation (Change to this.sprite.setScale if needed)
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	scrollForward(){
		this.loadout[this.activeWeapon].reset();
		this.activeWeapon++;
		if(this.activeWeapon > 2){
			this.activeWeapon = 0;
		}
		if(this.loadout[this.activeWeapon].loadTime > 0){
			this.scene.sound.play("start_reload", {volume:0.75});	
		}

		this.scene.refreshGUI();
	}

	scrollBackward(){
		this.loadout[this.activeWeapon].reset();
		this.activeWeapon--;
		if(this.activeWeapon < 0){
			this.activeWeapon = 2;
		}
		if(this.loadout[this.activeWeapon].loadTime > 0){
			this.scene.sound.play("start_reload", {volume:0.75});	
		}

		this.scene.refreshGUI();
	}

	checkBounds() {
		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}
	}

	handleInput() {
		this.inputVec.reset();

		// Keyboard input to vector
		if (!this.isTouched) {
			if (this.keyboard) {
				this.inputVec.x =
					(this.keyboard.left1.isDown || this.keyboard.left2.isDown ? -1 : 0) +
					(this.keyboard.right1.isDown || this.keyboard.right2.isDown ? 1 : 0);
				this.inputVec.y =
					(this.keyboard.up1.isDown || this.keyboard.up2.isDown ? -1 : 0) +
					(this.keyboard.down1.isDown || this.keyboard.down2.isDown ? 1 : 0);
			}
		}
		// Touch to input vector
		else {
			this.inputVec.copy(this.touchPos);
			this.inputVec.x -= this.x;
			this.inputVec.y -= this.y; // If needed, add offset so finger doesn't block, see TW.
			// if (this.inputVec.length() < 8) {
			// this.inputVec.reset();
			// }
			this.inputVec.scale(1 / 50);
		}
	}

	touchStart(x: number, y: number) {
		this.isTouched = true;
		this.isTapped = false;
		this.touchPos.x = x;
		this.touchPos.y = y;

		if (this.touchInsideBody(x, y)) {
			this.isTapped = true;
			this.tappedTimer = TAPPING_TIMER;
		}
	}

	touchDrag(x: number, y: number) {
		this.touchPos.x = x;
		this.touchPos.y = y;

		if (this.isTapped && !this.touchInsideBody(x, y)) {
			this.isTapped = false;
		}
	}

	touchEnd(x: number, y: number) {
		if (this.isTapped && this.tappedTimer > 0) {
			this.emit("action");
		}

		this.isTouched = false;
		this.isTapped = false;
	}

	touchInsideBody(x: number, y: number) {
		return (
			Phaser.Math.Distance.Between(this.x, this.y, x, y) <
			this.spriteSize
		);
	}

	toggleTracer(){
		this.scene.toggleTracer();
	}

	clearTracer(){
		this.scene.clearTracers();
	}

	fire(){
		this.firing = true;
	}

	unfire(){
		this.firing = false;
	}


	getActiveWeapon(): Weapon{
		return this.loadout[this.activeWeapon];
	}

	renderWeapon(){

	}

	doABarrelRoll() {
		if (!this.tween || !this.tween.isActive()) {
			this.tween = this.scene.tweens.add({
				targets: this.sprite,
				scaleX: {
					from: this.sprite.scaleX,
					to: -this.sprite.scaleX,
					ease: "Cubic.InOut",
				},
				duration: 300,
				yoyo: true,
			});
		}
	}
}
