import { UpgradeScene } from "@/scenes/UpgradeScene";
import { AugmentButton } from "../AugmentButton";
import { Augment } from "./Weapon";

export class AugmentBar extends Phaser.GameObjects.Container{
    public scene: UpgradeScene;
    public augbutton: AugmentButton;
    public ref: Augment;
    public bars: Phaser.GameObjects.Sprite[];
    private st: number = -268;
    private ofs: number = 52;
    constructor(scene:UpgradeScene,x:number,y:number, aug: Augment){
        super(scene,x,y);
        this.scene = scene;
        this.ref = aug;
        this.augbutton = new AugmentButton(this.scene,this.st-72,0);
        this.augbutton.load(this.ref.index)
        this.add(this.augbutton);
        this.bars = [];
        this.fillBar();
    }

    set(a: Augment){
        this.ref = a;
        this.redraw();
    }

    fillBar(){
        if(this.bars.length > 0) {
            console.log("Attempted to fill already initialized augment bar.");
            return;
        }
        for(let i = 0; i < this.ref.lvcap; i++){
            if(i < 10){ //push a bar if less than the cap
                this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug"));
            } else {
                this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug_extra"));
            }

            if(i < this.ref.level) {
                this.bars[i].setFrame(1)
            } else if (i < this.ref.maxlv) {
                this.bars[i].setFrame(0);
            } else {
                this.bars[i].setFrame(2);
            }
            this.add(this.bars[i]);
        }
    }

    redraw(){
        for(let i = 0; i < this.ref.lvcap; i++){
            if(i >= this.bars.length) { //if we didn't already print a bar, do so now
                if(i < 10){
                    this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug"));
                } else {
                    this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug_extra"));
                }
            }

            
            if(i < this.ref.level) {
                this.bars[i].setFrame(1)
            } else if (i < this.ref.maxlv) {
                this.bars[i].setFrame(0);
            } else {
                this.bars[i].setFrame(2);
            }

            
        }
    }
}