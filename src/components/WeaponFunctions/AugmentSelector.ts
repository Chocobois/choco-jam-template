import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "./Button";

export class AugmentSelector extends Button{
    public scene: UpgradeScene;

    public bmode: number = 0;

    private spr: Phaser.GameObjects.Sprite;
    private over: Phaser.GameObjects.Image;

    private augIndex: number = 0;

    public shadowed: boolean = false;
    constructor(scene: UpgradeScene, x: number, y: number, index: number){
        super(scene,x,y);
        this.scene = scene;
        this.spr = this.scene.add.sprite(0,0,"aug_select_frame");
        this.add(this.spr);
        this.augIndex = index;

        this.over = this.scene.add.image(0,0,"aug_" + this.augIndex);
    }


    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        super.onOver(pointer,localX,localY,event);
        if(!this.shadowed){
            this.spr.setFrame(1);
        }
    }

    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        super.onOut(pointer,event);
        if(!this.shadowed){
            this.spr.setFrame(0);
        }
    }

    shadow(){
        this.shadowed = true;
        this.spr.setFrame(0);
        this.setAlpha(0.35);
    }

    unshadow(){
        this.shadowed = false;
        this.setAlpha(1);
    }
}