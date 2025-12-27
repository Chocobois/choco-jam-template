import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "./Effect";

export class GibEffect extends Effect {
    private t: number[] = [5000,5000];
    private spin: number = 120;
    private spr: Phaser.GameObjects.Image;
    private v: number[] = [0,0];
    private vinit: number[] = [0,0];
    private accel: number[] = [0,0];
    private dTime: number[] = [1000,1000];
    constructor(scene: BaseScene, x:number, y:number, sp: string, vel: number[], a: number[], angle: number, decelTime: number, spin: number, fadeTime: number, scale: number[] = [1,1]) {
        super(scene,x,y);
        this.spr = this.scene.add.image(0,0,sp);
        this.spr.setOrigin(0.5,0.5);
        this.spr.setScale(scale[0],scale[1]);
        this.add(this.spr);
        //this.scene.add.existing(this);
        this.dTime = [decelTime,decelTime];
        this.v = vel;
        this.vinit = vel;
        this.t=[fadeTime,fadeTime];
        this.accel = a;
        this.spr.setAngle(angle);
        this.spin = (-1*spin)+(Math.random()*2*spin);
        //this.setDepth(3);
        //this.spr.setDepth(3);
    }

    update(t:number, d:number) {
        if(this.dTime[0] > 0){
            this.dTime[0] -= d;
            if(this.dTime[0] <= 0){
                this.dTime[0] = 0;
            }
        }
        if(this.t[0] > 0) {
            this.t[0] -= d;
            this.vinit[0] += this.accel[0]*d/1000;
            this.vinit[1] += this.accel[1]*d/1000;
            this.v[0] = this.vinit[0]*Math.sqrt(this.dTime[0]/this.dTime[1]);
            this.v[1] = this.vinit[1]*Math.sqrt(this.dTime[0]/this.dTime[1]);
            this.x += this.v[0]*d/1000;
            this.y += this.v[1]*d/1000;
            if(this.t[0]<=0){
                this.deleteFlag = true;
                this.spr.setVisible(false);
            } else {
                this.setAngle(this.angle+(Math.pow(this.dTime[0]/this.dTime[1],2)*this.spin*d/1000));
                this.spr.setAlpha(this.t[0]/this.t[1]);
            }
        }
    }
}