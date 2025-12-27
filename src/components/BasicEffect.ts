import { GameScene } from "@/scenes/GameScene";
import { Effect } from "./Effect";

export class BasicEffect extends Effect {
    public scene: GameScene;
    public sp: Phaser.GameObjects.Sprite;
    private isLooped: boolean;
    private frameLength: number;
    private timer: number = 0;
    private totalFrames: number;
    private startingFrame: number;
    private currentFrame: number = 0;
    public deleteFlag: boolean = false;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public spAngle: number;

	// private hover: boolean;
	constructor(scene: GameScene, value: string, x: number, y: number, tFrames: number, fLen: number = 100, loop: boolean = false, sFrame: number = 0, angle: number = 0, scale: number[] = [1,1]) {
        super(scene,x,y);
        this.scene = scene;
        //scene.add.existing(this);
		this.sp = this.scene.add.sprite(0, 0, value);
		this.sp.setOrigin(0.5, 0.5);
        this.sp.setAngle((180/Math.PI)*angle);
        this.sp.setScale(scale[0], scale[1]);
        this.frameLength = fLen;
        this.isLooped = loop;
        this.totalFrames = tFrames;
        this.startingFrame = sFrame;
        this.currentFrame = this.startingFrame;
        this.sp.setFrame(this.startingFrame);
        this.add(this.sp);
        this.setDepth(2);
       // scene.add.existing(this.sp);
	}

    setVelocityX(v: number){
        this.velocityX = v;
    }

    setVelocityY(v: number) {
        this.velocityY = v;
    }

    stopMovement(){
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(t: number, d: number){
        if(this.deleteFlag){
            return;
        }
        if (this.timer <= this.frameLength) {
            this.timer += d;
            this.x += this.velocityX*d*0.001;
            this.y += this.velocityY*d*0.001;
            if (this.timer >= this.frameLength) {
                this.timer = 0;
                if(this.currentFrame < (this.totalFrames-1)) {
                    this.currentFrame++;
                    this.sp.setFrame(this.currentFrame);
                } else if (this.currentFrame >= (this.totalFrames-1)) {
                    if(this.isLooped) {
                        this.currentFrame = 0;
                        this.sp.setFrame(this.currentFrame);
                    } else {
                        this.deleteFlag = true;
                        this.sp.setAlpha(0);
                    }
                }
                
            }
        }
    }
}
