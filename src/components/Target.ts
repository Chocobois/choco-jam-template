import { GameScene } from "@/scenes/GameScene";
import { DmgStack, HitLog } from "./WeaponFunctions/WeaponOperator";

export class Target extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public radius: number = 100;
    public deleteFlag: boolean = false;
    public hitStun: number = 0;
    public stackLog: Map<number,DmgStack>;
    public bLog: Map<number,HitLog>;

    public tID: number = 0;
    //public pID: number = 0;


    constructor(scene:GameScene,x:number,y:number){
        super(scene,x,y);
        this.scene = scene;
    }

    update(t:number,d:number){

    }

    takeDamage(n: number){

    }

    takePierceDamage(n: number, p: number, wID: number){

    }

    addStack(pd: number, ap: DmgStack){

    }

    hasStack(n: number): boolean{
        if(this.stackLog.has(n)){
            if(this.stackLog.get(n) != null) {
                //console.log("CHECK SUCCESS");
                return true;
            } else {
                //console.log("NULL STACK");
                return false;
            }
        } else {
            //console.log("NO STACK PRESENT: "+ n);
            //console.log(this.stackLog);
            return false;
        }
    }

    checkBulletLog(n: number): boolean{
        if(this.bLog.has(n)){
            let r = this.bLog.get(n);
            if(r != null){
                if(r.cooldown == 0){
                    //console.log("CD IS ZERO");
                    return true; //prev hit and cd IS 0
                } else {
                    //console.log("CD TOO LONG: " + r.cooldown);
                    return false; //prev hit and cd is not 0
                }
            } else {
                //console.log("NULL VALUE");
                return true;
            }
        } else {
            //console.log("NOT HIT");
            return true; //not prev hit
        }

    }
}