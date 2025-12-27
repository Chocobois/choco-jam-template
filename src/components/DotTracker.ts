import { BaseScene } from "@/scenes/BaseScene"
export class DotTracker extends Phaser.GameObjects.Container{

    public gfx: Phaser.GameObjects.Graphics

    constructor(scene: BaseScene,x: number, y: number) {
        super(scene,x,y);
        this.gfx = this.scene.add.graphics();
        this.add(this.gfx);
        this.gfx.fillStyle(0xFF8080,0.85);

		this.gfx.beginPath();
		this.gfx.slice(0,0,10,0,360,false,0.005);
		this.gfx.closePath();
		this.gfx.fillPath();
    }
}