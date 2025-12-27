import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "./WeaponFunctions/Button";

export class AugmentButton extends Button {
    public scene: UpgradeScene;

    private back: Phaser.GameObjects.Sprite;
    private img: Phaser.GameObjects.Image;
    private over: Phaser.GameObjects.Sprite;
    private curIndex: number =  0;
    private mode: number = 0; 
    private static EMPTY: number = 0;
    private static UPGRADE: number = 1;

    constructor(scene:UpgradeScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;

        this.back = this.scene.add.sprite(0,0,"aug_button_back");
        this.over = this.scene.add.sprite(0,0,"aug_button_frame");
        this.img = this.scene.add.image(0,0,"aug_0");

        this.add(this.back);
        this.add(this.img);
        this.add(this.over);

        this.bindInteractive(this.back);
        this.back.setInteractive();
    }

    load(id: number){
        this.curIndex = id;
        this.img.setTexture("aug_"+this.curIndex);
        if(this.curIndex == 0){
            this.mode = AugmentButton.EMPTY;
            this.over.setFrame(1);
            this.back.setFrame(1);
        } else {
            this.mode = AugmentButton.UPGRADE;
            this.over.setFrame(0);
            this.back.setFrame(0); 
        }
    }

    onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
        super.onDown(pointer, localX, localY, event);
	}

}