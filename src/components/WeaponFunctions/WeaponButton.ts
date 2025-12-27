import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./Button";
import { UpgradeScene } from "@/scenes/UpgradeScene";
import { WeaponParams } from "./WeaponOperator";

export class WeaponButton extends Button {
    public scene: UpgradeScene;
    public spr: Phaser.GameObjects.Sprite;
    public wp: WeaponParams;
    public gID: number;

    public dir: number = 0;
    public moving: boolean = false;
    public target: number = 0;
    public vy: number = 1400;
    public over: Phaser.GameObjects.Image;
    public back: Phaser.GameObjects.Image;
    public equipped: boolean = false;
    public position: number = 0;
    public sprname: string = "";
    public dragging: boolean = false;

    constructor(scene:UpgradeScene, x: number, y : number, wID: number, gID: number, pos: number){
        super(scene,x,y);
        this.scene = scene;
        this.wp = this.scene.masterData.getParams(wID);

        this.back = this.scene.add.image(0,0,"gunback");
        this.add(this.back);
        this.back.setOrigin(0.5,0.5);
        this.back.setDepth(0);
        this.bindInteractive(this.back);
        this.back.setInteractive();

        this.sprname = "gun_"+this.wp.type;
        this.spr = this.scene.add.sprite(0,0,this.sprname);
        this.add(this.spr);
        this.spr.setOrigin(0.5,0.5);
        this.spr.setDepth(2);
        this.gID = gID;
        //this.spr.setInteractive();
        this.over = this.scene.add.image(0,0,"equip");
        this.add(this.over);
        this.over.setOrigin(0.5,0.5);
        this.over.setDepth(5);
        this.over.setVisible(false);
        this.over.setAlpha(0.75);
        this.position = pos;
    }

    update(t: number, d: number){
        if(this.position == this.scene.curPos){
            this.setScale(1.0,1.0);
            this.setAlpha(1.0);
        } else {
            this.setScale(0.75,0.75);
            this.setAlpha(0.75);
        }
        if(this.moving){
            this.y+=this.vy*d*this.dir/1000;
            if(this.dir == 1) {
                this.checkLow();
            } else if (this.dir == -1) {
                this.checkHigh();
            }
        } else {
            this.checkSnaps();
        }
    }

    checkSnaps(){
        if(this.position == this.scene.curPos){
            if(this.y != 688){
                console.log("incorrect snap: " + "element " + this.position + " at position " + this.scene.curPos + " incorrectly at: " + this.y);
            }
        }
    }

    equip(){
        //this.back.removeInteractive();
        this.spr.setAlpha(0.75);
        this.over.setVisible(true);
        this.equipped = true;
    }

    unequip(){
        //this.back.setInteractive();
        this.spr.setAlpha(1);
        this.over.setVisible(false);
        this.equipped = false;
    }


    checkLow(){
        if(this.y > this.target) {
            this.y = this.target;
            this.moving = false;
            this.dir = 0;
            this.target = 0;
            this.back.setInteractive();
        }
    }

    checkHigh(){
        if(this.y < this.target) {
            this.y = this.target;
            this.moving = false;
            this.dir = 0;
            this.target = 0;
            this.back.setInteractive();
        }
    }

    onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
        super.onDown(pointer, localX, localY, event);
        this.dragging = false;
        this.scene.cancelDrag();

        if(this.position < this.scene.curPos) {
            //console.log("SCROLL UP TO: " +this.position + " FROM: " + this.scene.curPos);
            this.scene.scrollUp();
        } else if(this.position > this.scene.curPos) {
            //console.log("SCROLL DOWN TO: " +this.position + " FROM: " + this.scene.curPos);
            this.scene.scrollDown();
        } else {
            if(!this.equipped){
                this.dragging = true;
            }
        }
	}

    updateDrag(x:number,y:number){
        if(this.dragging){
            if(Math.sqrt(Math.pow(y-this.y,2)+Math.pow(x-this.x,2)) > 200){
                this.scene.startDrag(this);
            }
        }
    }

    endDrag(){
        this.dragging = false;
    }

    onUp(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		super.onUp(pointer,localX,localY,event);
        if(this.dragging){
            this.scene.snap();
        }
        this.dragging = false;

	}

    scrollDown(n: number){
        this.dragging = false;
        if(!this.moving){
            this.moving = true;
            this.target = this.y-n;
            this.dir = -1;
            this.back.disableInteractive();
            if(this.position == this.scene.curPos){
                this.scene.select(this);
            }
            this.scene.sound.play("shift",{volume: 0.5});
        }

    }

    scrollUp(n: number){
        this.dragging = false;
        if(!this.moving){
            this.moving = true;
            this.target = this.y+n;
            this.dir = 1;
            this.back.disableInteractive();
            if(this.position == this.scene.curPos){
                this.scene.select(this);
            }
            this.scene.sound.play("shift",{volume: 0.5});
        }

    }

    onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number): void {
        super.onDrag(pointer,dragX,dragY);
        console.log("Dragging");
        if(Math.sqrt(Math.pow(pointer.y-this.y,2) + Math.pow(pointer.x-this.x,2)) > 200){
            this.scene.startDrag(this);
        }
    }
    


}