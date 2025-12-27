import { UpgradeScene } from "@/scenes/UpgradeScene";
import { AugmentSelector } from "./AugmentSelector";

export class AugmentScreen extends Phaser.GameObjects.Container{
    public scene: UpgradeScene;
    public buttons: AugmentSelector[];
    constructor(scene: UpgradeScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;

    }

    initiate(){

    }

    close(){
        
    }

    createButtons(){
        //auglist is in globalvariables

        let t = 0;
        let iy = 0;
        for(let s = 1; s < this.scene.masterData.augList.length; s++) {
            if(t > 4) {
                t = 0;
                iy++;
            }
            this.buttons.push(new AugmentSelector(this.scene,210+(t*300),140+(iy*300),s));
            this.add(this.buttons[s-1]);
        }
    }
}