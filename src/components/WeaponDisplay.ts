import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "./Player";

export class WeaponDisplay extends Phaser.GameObjects.Container{

    public scene: BaseScene;
    public owner: Player;
    public curSprite: Phaser.GameObjects.Sprite;
    constructor(scene: BaseScene,x:number,y:number,owner:Player){
        super(scene,x,y);
        this.scene = scene;
        this.owner = owner;
        this.curSprite = this.scene.add.sprite(0,0,"gungun");
        this.curSprite.setOrigin(0.5,0.5);
        this.add(this.curSprite);
        this.owner.add(this);
    }

    update(t:number,d:number,a:number){
        this.curSprite.setAngle((360/(2*Math.PI))*a);
    }

}