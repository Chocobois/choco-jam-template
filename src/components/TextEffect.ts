import { GameScene } from "@/scenes/GameScene";
import { Effect } from "./Effect";

export class TextEffect extends Effect{
    public scene: GameScene;
    public timer: number = 0;
    public maxTimer: number = 0;
    public myText: Phaser.GameObjects.Text;
    private txt: string;
    public color1: string;
    public color2: string;
    public fadeTime: number = 800;
    public maxFadeTime: number = 800;
    public deleteFlag = false;
    private isFlashing: boolean = false;
    private flashTimer: number = 100;
    private maxFlashTimer: number = 100;
    private colors: string[];
    private index: number = 0;
    private phase: number = 1;
    private dmod: number;
    private amod: number;
    private negative: number = -1;
    private amp: number = 1;

    constructor(scene:GameScene, x: number, y: number, txt: string, color1: string = "yellow", size: number = 30, flash: boolean = false, 
    color2: string = "red", fadeTime: number = 800, flashTime: number = 100, valence: number = 1, amplitude: number = 1) {
        super(scene,x,y);
        this.scene = scene;
        this.myText = this.scene.addText({
			x: 0,
			y: 0,
			size: size,
			color: this.color1,
			text: txt,
		});
        this.phase = Math.random();
        if(this.phase > 0.5) {
            this.phase = -1;
        } else {
            this.phase = 1;
        }
        this.isFlashing = flash;
        this.color1 = color1;
        this.color2 = color2;
        this.myText.setColor(color1);
        this.myText.setOrigin(0.5, 0.5);
        this.fadeTime = fadeTime;
        this.maxFadeTime = fadeTime;
        this.add(this.myText);
        this.scene.add.existing(this);
        this.setDepth(1);
        this.dmod = 75*Math.random();
        this.amod = 2*Math.random();
        this.negative = valence;
        this.amp = amplitude;
        this.flashTimer = flashTime;
        this.maxFlashTimer = flashTime;
        this.setDepth(2);
    }

    update(d: number, t: number) {
        this.y -= this.negative*(120*d/1000);
        this.x += this.phase*this.amp*(2+this.amod)*Math.sin(t/(125+this.dmod));
        if(this.isFlashing){
            if(this.flashTimer > 0) {
                this.flashTimer -= d;
            }
            if(this.flashTimer <= 0) {
                this.flashTimer = this.maxFlashTimer;
                this.flash();
            }
        }
        if(this.fadeTime > 0) {
            this.fadeTime -= d;
        }
        if(this.fadeTime <= 0){
            this.fadeTime = 0;
            this.deleteFlag = true;
        }
        this.myText.setAlpha(this.fadeTime/this.maxFadeTime);
    }

    flash(){
        if(this.index == 0) {
            this.index = 1;
            this.myText.setColor(this.color2);
        } else {
            this.index = 0;
            this.myText.setColor(this.color1);     
        }
    }
}