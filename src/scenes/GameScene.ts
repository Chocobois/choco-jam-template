import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Bullet } from "@/components/WeaponFunctions/Bullet";
import { LineSegment } from "@/components/WeaponFunctions/LineSegment";
import { Effect } from "@/components/Effect";
import { Target } from "@/components/Target";
import { Thug } from "@/components/Thug";
import { WeaponOperator } from "@/components/WeaponFunctions/WeaponOperator";
import { GunUI } from "@/components/WeaponFunctions/GunUI";
import { GlobalVariables } from "@/components/GlobalVariables";
import { Tracer } from "@/components/WeaponFunctions/Tracer";
import { DotTracker } from "@/components/DotTracker";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	public player: Player;
	private ui: UI;

	private pID: number = -999999999;
	private tID: number = -999999999;
	private tyText:Phaser.GameObjects.Text;

	private bDisp: Phaser.GameObjects.Container;
	private tDisp: Phaser.GameObjects.Container;
	private eDisp: Phaser.GameObjects.Container;
	private fDisp: Phaser.GameObjects.Container;

	private dotter: Phaser.GameObjects.Graphics;

	private tracers: Phaser.GameObjects.Container;

	public handler: WeaponOperator;

	private bList: Bullet[];
	private tList: Target[];
	private hitEffects: Effect[];
	private partEffects: Effect[];
	private tracerList: Tracer[];

	private dotList: DotTracker[];

	private gUI: GunUI;

	private sCD: number = 500;
	public masterData: GlobalVariables;

	public tracing: boolean = false;


	private ls: LineSegment;

	constructor() {
		super({ key: "GameScene" });
	}


	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.background = this.add.image(0, 0, "tempbkg");
		this.background.setOrigin(0.5,0.5);
		this.background.setScale(4);
		this.background.setDepth(-10);
		this.cameras.main.setBounds(-5000,-5000,10000,10000);
		this.cameras.main.setZoom(0.5,0.5);


		this.tyText = this.addText({
			x: 0,
			y: -160,
			size: 40,
			color: "#FFFFFF",
			text: "",
		});
		this.tyText.setOrigin(0.5,0.5);
		//this.tyText.setScrollFactor(0);

		//MUST BE IN THIS ORDER
		this.player = new Player(this, this.CX, this.CY);
		this.handler = new WeaponOperator(this.player);
		this.player.setDefaultLoadout();
		this.gUI = new GunUI(this,this.player.x,this.player.y, [-1358, -860]);
		this.gUI.setScale(1.5);
		this.add.existing(this.gUI);
		this.gUI.setDepth(20);


		this.player.setDepth(10);
		this.player.on("action", () => {
			this.player.doABarrelRoll();
		});
		this.cameras.main.startFollow(this.player);

		//arrays
		this.bList = [];
		this.tList = [];
		this.hitEffects = [];
		this.partEffects = [];

		this.dotList = [];
		this.tracerList = [];


		this.bDisp = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.bDisp);
		this.bDisp.setDepth(8);

		this.tDisp = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.tDisp);
		this.tDisp.setDepth(7);

		this.ls = new LineSegment(this,200,200,-500,210);
		this.ls.setDepth(14);

		this.eDisp = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.eDisp);
		this.eDisp.setDepth(9);

		this.fDisp = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.fDisp);
		this.fDisp.setDepth(6);

		this.tracers = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.tracers);
		this.tracers.setDepth(11);

		this.dotter = this.add.graphics();
		this.dotter.fillStyle(0xFF8080,0.85);
		this.add.existing(this.dotter);
		this.dotter.setDepth(15);

		/*
		this.dotter.beginPath();
		this.dotter.slice(0,0,10,0,360,false,0.005);
		this.dotter.closePath();
		this.dotter.fillPath();
		*/
		this.ui = new UI(this);

		this.initTouchControls();
		this.spawnTestObjects();



	}

	spawnTestObjects(){
		/*
		let ttt = new Thug(this,-800,600);
		this.tDisp.add(ttt);
		this.tList.push(ttt);

		let ttn = new Thug(this,1000,1000);
		this.tDisp.add(ttn);
		this.tList.push(ttn);
		*/
	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		const worldX = this.cameras.main.getWorldPoint(pointer.x, pointer.y).x;
 		const worldY = this.cameras.main.getWorldPoint(pointer.x, pointer.y).y;
		this.tyText.setPosition(worldX,worldY+80);
		this.tyText.setText("Pointer: " + worldX + ", " + worldY);
		this.player.update(time, delta);
		this.ls.hitCheck(this.player);
		this.ls.update(time,delta);
		this.spawnEnemies(time,delta);
		this.updateTargets(time,delta);
		this.updateBullets(time,delta);
		this.updateEffects(time,delta);
		this.gUI.update(time,delta);

	}

	spawnEnemies(t:number, d:number){
		
		if(this.sCD > 0){
			this.sCD -= d;
			if(this.sCD <= 0){
				if(this.tList.length > 200) {
					//console.log("LEN: " + this.tList.length);
					this.sCD = 500;
				} else {
					let aa = Math.random()*2*Math.PI;
					let ti = new Thug(this, Math.cos(aa)*4542,Math.sin(aa)*4542);
					this.tDisp.add(ti);
					this.tList.push(ti);
					if(Math.random()< 0.5){
						aa = Math.random()*2*Math.PI;
						let tn = new Thug(this, Math.cos(aa)*4542,Math.sin(aa)*4542);
						this.tDisp.add(tn);
						this.tList.push(tn);
					}
					this.sCD = 500;
				}

			}
		}
		
		
	}

	refreshGUI(){
		this.gUI.refresh();
	}

	updateTargets(t:number,d:number){
		for(let i = (this.tList.length-1); i >= 0; i--){
			this.tList[i].update(t, d);
			if(this.tList[i].deleteFlag){
				this.tList[i].destroy();
				this.tList.splice(i,1);
			}
		}
	}

	updateEffects(t: number, d: number){
		for(let h = (this.hitEffects.length-1); h >= 0; h--){
			this.hitEffects[h].update(t, d);
			if(this.hitEffects[h].deleteFlag) {
				this.hitEffects[h].destroy();
				this.hitEffects.splice(h,1);
			}
		}

		for(let f = (this.partEffects.length-1); f >= 0; f--){
			this.partEffects[f].update(t, d);
			if(this.partEffects[f].deleteFlag) {
				this.partEffects[f].destroy();
				this.partEffects.splice(f,1);
			}
		}

		for(let l = (this.tracerList.length-1); l >= 0; l--){
			this.tracerList[l].hitCheckT(this.tList[0]);
			this.tracerList[l].update(t, d);
		}

	}

	updateBullets(t:number,d:number){
		for(let i = (this.bList.length-1); i >= 0; i--){

			this.bList[i].updatePos(t,d);
			for(let e = this.tList.length-1; e >= 0; e--) {
				this.bList[i].hitCheck(this.tList[e]);
			}
			this.bList[i].updateGFX(t,d);

			if(this.bList[i].deleteFlag){
				this.bList[i].destroy();
				this.bList.splice(i,1);
			}
		}
	}

	addHitEffect(e: Effect){
		this.hitEffects.push(e);
		this.eDisp.add(e);
	}

	addPartEffect(e: Effect){
		this.partEffects.push(e);
		this.fDisp.add(e);
	}


	initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			/*
			if (!this.player.isTouched) {
				//this.player.touchStart(pointer.x, pointer.y);
				//touchId = pointer.id;
				//touchButton = pointer.button;
			}
			else if (this.player.isTouched && !this.player.isTapped) { // Use second touch point as a trigger
				//this.player.doABarrelRoll();
			}
			*/
			if(this.player != null){
				this.player.fire();
			}

		});

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			if (touchId == pointer.id) {
				//this.player.touchDrag(pointer.x, pointer.y);
			}
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			/*
			if (touchId == pointer.id && touchButton == pointer.button) {
				// this.ui.debug.setText(`${new Date().getTime()} - id:${pointer.id} button:${pointer.button}`);
				//this.player.touchEnd(pointer.x, pointer.y);
			}
			*/
			if(this.player != null){
				this.player.unfire();
			}
		});
	}

	toggleTracer(){
		if(this.tracing) {
			this.tracing = false;
		} else {
			this.tracing = true;
		}
	}

	addTracer(t: Tracer){
		this.add.existing(t);
		this.tracers.add(t);
		this.tracerList.push(t)
		t.draw();
	}

	clearTracers(){
		for(let r = 0; r < this.tracerList.length; r++){
			this.tracerList[r].destroy()
		}

		for(let d = 0; d < this.dotList.length; d++){
			this.dotList[d].destroy()
		}
		this.tracerList = [];
		this.dotList = [];
	}

	addBullet(b: Bullet){
		this.bList.push(b);
		if(this.tracing) {
			b.trace = true;
		}
		this.bDisp.add(b);
	}

	getProjID(): number{
		this.pID++;
		if(this.pID > 999999999){
			this.pID = -999999999;
		}
		return this.pID;
	}

	dot(x: number, y: number){
		let gfx = new DotTracker(this,x,y);
		//this.add.existing(gfx);
		this.tracers.add(gfx);
		this.dotList.push(gfx);
		this.add.existing(gfx);
		//console.log("dot: "+ x + ", "+ y);

	}

	getTargetID(): number{
		this.tID++;
		if(this.tID > 999999999){
			this.tID = -999999999;
		}
		return this.tID;
	}

	progress(){
		this.addEvent(1050, () => {
			//this.musicTitle.stop();
			this.scene.start("UpgradeScene", {gameData: this.masterData});
		});
	}
}
