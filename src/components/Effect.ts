import { GameScene } from "@/scenes/GameScene";
import { BaseScene } from "@/scenes/BaseScene";

export class Effect extends Phaser.GameObjects.Container {
    public deleteFlag: boolean = false;
    constructor(scene: BaseScene, x: number, y: number) {
        super(scene,x,y);
        this.scene = scene;
        this.deleteFlag = false;
    }

    update(t: number, d: number) {
    }
}