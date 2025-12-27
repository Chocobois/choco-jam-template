import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Armory } from "@/components/WeaponFunctions/Armory";
import { GlobalVariables } from "@/components/GlobalVariables";
import { WeaponButton } from "@/components/WeaponFunctions/WeaponButton";
import { AugmentUI } from "@/components/WeaponFunctions/AugmentUI";

export class UpgradeScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private overlay: Phaser.GameObjects.Image;
	private midlay: Phaser.GameObjects.Image;
	private botlay: Phaser.GameObjects.Image;

	private flashlines: Phaser.GameObjects.Image;

    public activeWeaponImage: Phaser.GameObjects.Sprite;
	//public myarmory: Armory;
	public masterData: GlobalVariables;

	public buttonList: WeaponButton[] = [];
	public lockout: number = 0;
	public maxlockout: number = 200;

	public dragging: boolean = false;

	public pImage: Phaser.GameObjects.Image;
	public sdImage: Phaser.GameObjects.Image;
	public secImage: Phaser.GameObjects.Image;
	public curPos: number = 0;

	public dragGun: Phaser.GameObjects.Image;
	public gunning: boolean = false;
	public gImage: Phaser.GameObjects.Image;
	public p1: Phaser.Math.Vector2;
	public p2: Phaser.Math.Vector2;
	public p3: Phaser.Math.Vector2;
	public side: number = -999999999;
	public prim: number = -999999998;
	public sec: number = -999999997;

	public augUI: AugmentUI;
	public equippedButtons: WeaponButton[];

	constructor() {
		super({ key: "UpgradeScene" });
	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
	}

	create(): void {
		this.initButtons();
		this.initTouchControls();
		this.background = this.add.image(0, 0, "upgradebkg");
		this.background.setOrigin(0,0);
		this.background.setScale(1);
		this.background.setDepth(0);


		this.overlay = this.add.image(0, 0, "topbar");
		this.overlay.setOrigin(0,0);
		this.overlay.setScale(1);
		this.overlay.setDepth(10);

		this.midlay = this.add.image(0, 0, "midbar");
		this.midlay.setOrigin(0,0);
		this.midlay.setScale(1);
		this.midlay.setDepth(2);

		this.botlay = this.add.image(0, 0, "bottombar");
		this.botlay.setOrigin(0,0);
		this.botlay.setScale(1);
		this.botlay.setDepth(1);

		this.flashlines = this.add.image(0, 0, "redlines");
		this.flashlines.setOrigin(0,0);
		this.flashlines.setScale(1);
		this.flashlines.setDepth(3);

		this.gImage = this.add.image(960,540,"blank");
		this.add.existing(this.gImage);
		this.gImage.setScale(1.5,1.5);
		this.gImage.setDepth(4);

		this.dragGun = this.add.image(0,0,"blank");
		this.dragGun.setDepth(12);
		this.select(this.buttonList[0]);

		this.sdImage = this.add.image(621,128,"gun_" + this.buttonList[0].wp.type);
		this.add.existing(this.sdImage);
		this.sdImage.setDepth(11);
		this.pImage = this.add.image(1142,128,"gun_" + this.buttonList[1].wp.type);
		this.add.existing(this.pImage);
		this.pImage.setDepth(11);
		this.secImage = this.add.image(1661,128,"gun_" + this.buttonList[2].wp.type);
		this.add.existing(this.secImage);
		this.secImage.setDepth(11);

		this.equippedButtons = [];

		this.buttonList[0].equip();
		this.buttonList[1].equip();
		this.buttonList[2].equip();

		this.equippedButtons.push(this.buttonList[0]);
		this.equippedButtons.push(this.buttonList[1]);
		this.equippedButtons.push(this.buttonList[2]);

		this.p1 = new Phaser.Math.Vector2(621,128);
		this.p2 = new Phaser.Math.Vector2(1142,128);
		this.p3 = new Phaser.Math.Vector2(1661,128);

		this.augUI = new AugmentUI(this,0,0,this.buttonList[0].gID);
		this.augUI.setDepth(20);

		this.fade(false, 200, 0x000000);



	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		this.dragGun.x = pointer.x;
		this.dragGun.y = pointer.y;
		this.flashlines.setAlpha(0.125+0.125*(1+Math.sin(time/500)));

		if(this.dragging){
			this.shadeClosest();
		}

		this.buttonList.forEach((r)=> {
			r.update(time,delta);
			r.updateDrag(pointer.x,pointer.y);
		});
		if(this.lockout > 0) {
			this.lockout -= delta;
			if(this.lockout <= 0){
				this.lockout = 0;
			}
		}
	}

	initButtons(){
		this.buttonList = [];

		let n = 0;
		for(let [k, v] of this.masterData.inv.gunList) {
			this.addButton(new WeaponButton(this,256,688+(256*n),v.wID,k,n));
			n++;
		}
		//256, 432
		this.curPos = 0;
		/*
		if(this.buttonList.length > 3){
			this.buttonList[this.buttonList.length-1].y = (432-256);
		}
		this.reorder();
		*/

	}

	elevateButton(w: WeaponButton){
		w.setDepth(20);
	}

	delevateButton(w: WeaponButton){
		w.setDepth(5);
	}

	addButton(w: WeaponButton){
		this.add.existing(w);
		w.setDepth(5);
		this.buttonList.push(w);
	}

	scrollDown(){
		this.cancelDrag();
		if(this.lockout > 0){
			return;
		}
		//console.log("SCROLL DOWN");
		this.curPos++;
		if(this.curPos < this.buttonList.length) {
			for(let n = 0; n < this.buttonList.length; n++){
				this.buttonList[n].scrollDown(256);
			}
			//this.lockout = this.maxlockout;
		} else {
			this.curPos = this.buttonList.length - 1;
			return;
		}
		this.augUI.swapGun(this.buttonList[this.getCurrentButton()].gID);
		this.lockout = this.maxlockout;


	}

	scrollUp(){
		this.cancelDrag();
		if(this.lockout > 0){
			return;
		}
		//console.log("SCROLL UP");
		this.curPos--;
		if(this.curPos >= 0) {
			for(let n = 0; n < this.buttonList.length; n++){
				this.buttonList[n].scrollUp(256);
			}
			//this.lockout = this.maxlockout;
		} else {
			this.curPos = 0;
			return;
		}
		this.augUI.swapGun(this.buttonList[this.getCurrentButton()].gID);
		this.lockout = this.maxlockout;
	}

	reorder(){
		this.buttonList.sort((a,b)=> (a.y-b.y)); //sort array of hit enemies
	}

	startDrag(w: WeaponButton){
		if(!this.dragging){
			this.dragGun.setTexture("gun_"+w.wp.type);
			this.dragging = true;
		}
	}

	getCurrentButton(): number{
		for(let n = 0; n < this.buttonList.length; n++){
			if(this.buttonList[n].position == this.curPos){
				return n;
			}
		}
		console.log("CANNOT FIND WEAPON AT CURPOS")
		return 0;
	}

	shadeClosest(){
		let ip = new Phaser.Math.Vector2(this.dragGun.x, this.dragGun.y);
		let pp1 = this.getDistance(this.p1,ip);
		let pp2 = this.getDistance(this.p2,ip);
		let pp3 = this.getDistance(this.p3,ip);
		let closest = 0;
		let rr = this.getCurrentButton();
		let cindex = 0;
		if(this.buttonList[rr].wp.class == "pistol"){
			closest = pp1;
			if(pp1 > 400){
				this.sdImage.setAlpha(1);
				this.pImage.setAlpha(1);
				this.secImage.setAlpha(1);
				return;
			}
		} else {
			closest = pp2;
			if((pp2 > 400) && (pp3 > 400)){
				this.sdImage.setAlpha(1);
				this.pImage.setAlpha(1);
				this.secImage.setAlpha(1);
				return;;
			}
			cindex = 1;
			if(pp3 < closest){
				pp3 = closest;
				cindex = 2;
			}
		}

		switch(cindex){
			case 0: {
				this.sdImage.setAlpha(0.5);
				this.pImage.setAlpha(1);
				this.secImage.setAlpha(1);
				break;
			} case 1: {
				this.sdImage.setAlpha(1);
				this.pImage.setAlpha(0.5);
				this.secImage.setAlpha(1);
				break;
			} case 2: {
				this.sdImage.setAlpha(1);
				this.pImage.setAlpha(1);
				this.secImage.setAlpha(0.5);
				break;
			} default: {
				break;
			}
		}
	}

	snap(){
		if(!this.dragging){
			return;
		}
		let ip = new Phaser.Math.Vector2(this.dragGun.x, this.dragGun.y);
		let pp1 = this.getDistance(this.p1,ip);
		let pp2 = this.getDistance(this.p2,ip);
		let pp3 = this.getDistance(this.p3,ip);
		let closest = 0;
		let rr = this.getCurrentButton();
		let cindex = 0;
		if(this.buttonList[rr].wp.class == "pistol"){
			closest = pp1;
			if(pp1 > 400){
				this.cancelDrag();
				return;
			}
		} else {
			closest = pp2;
			if((pp2 > 400) && (pp3 > 400)){
				this.cancelDrag();
				return;
			}
			cindex = 1;
			if(pp3 < closest){
				pp3 = closest;
				cindex = 2;
			}
		}

		this.buttonList[rr].equip();
		this.sound.play("equip",{volume:0.75});
		this.pImage.setAlpha(1);
		this.sdImage.setAlpha(1);
		this.secImage.setAlpha(1);
		switch(cindex){
			case 0: {
				this.side = this.buttonList[rr].gID;
				this.sdImage.setTexture("gun_"+this.buttonList[rr].wp.type);
				this.equippedButtons[0].unequip();
				this.equippedButtons[0] = this.buttonList[rr];
				this.cancelDrag();
				break;
			} case 1: {
				this.prim = this.buttonList[rr].gID;
				this.pImage.setTexture("gun_"+this.buttonList[rr].wp.type);
				this.equippedButtons[1].unequip();
				this.equippedButtons[1] = this.buttonList[rr];
				this.cancelDrag();
				break;
			} case 2: {
				this.sec = this.buttonList[rr].gID;
				this.secImage.setTexture("gun_"+this.buttonList[rr].wp.type);
				this.equippedButtons[2].unequip();
				this.equippedButtons[2] = this.buttonList[rr];
				this.cancelDrag();
				break;
			} default: {
				break;
			}
		}

	}

	cancelDrag(){
		this.dragging = false;
		this.dragGun.setTexture("blank");
	}

	getDistance(v1: Phaser.Math.Vector2, v2: Phaser.Math.Vector2): number{
		return Math.sqrt(Math.pow(v1.y-v2.y,2)+Math.pow(v1.x-v2.x,2));
	}

	select(w: WeaponButton){
		this.gImage.setTexture(w.sprname);
	}

	fetchGun(i: number){
		return this.masterData.inv.fetchGun(i);
	}

	gunToPosition(){
		
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


		});

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			if (touchId == pointer.id) {
				//this.player.touchDrag(pointer.x, pointer.y);
			}
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			if(this.dragging){
				this.snap();
				this.buttonList[this.getCurrentButton()].endDrag();
			} else {
				this.cancelDrag();
			}
			/*
			if (touchId == pointer.id && touchButton == pointer.button) {
				// this.ui.debug.setText(`${new Date().getTime()} - id:${pointer.id} button:${pointer.button}`);
				//this.player.touchEnd(pointer.x, pointer.y);
			}
			*/

		});
	}



	
}
