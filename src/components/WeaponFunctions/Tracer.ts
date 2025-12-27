import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "../Player";
import { Target } from "../Target";

export class Tracer extends Phaser.GameObjects.Container {
    private gfx1: Phaser.GameObjects.Graphics;
    private gfx2: Phaser.GameObjects.Graphics;
    private gfx3: Phaser.GameObjects.Graphics;
    private gfx4: Phaser.GameObjects.Graphics;
    public scene: BaseScene;
    private inputVec: Phaser.Math.Vector2;
    private drawVecs: Phaser.Math.Vector2[];
    public ex: number;
    public ey: number;
    private lcount: number = 1;

    //public cooldown: number = 100;
    constructor(scene: BaseScene,x: number, y: number, endx: number, endy: number, hit: boolean, hitPoints: Phaser.Math.Vector2[]){
        super(scene,x,y);
        this.ex = endx;
        this.ey = endy;
        this.scene = scene;
        this.drawVecs = hitPoints;
        this.gfx1 = this.scene.add.graphics();
        this.gfx2 = this.scene.add.graphics();
        this.gfx3 = this.scene.add.graphics();
        this.gfx4 = this.scene.add.graphics();

        this.gfx1.fillStyle(0x008080,0.85);
        this.gfx1.lineStyle(10,0x008080,0.85);
        if(hit){
            this.gfx2.lineStyle(5,0xFF0000,1);    
        } else {
            this.gfx2.lineStyle(5,0x00FF00,1);
        }
        this.gfx4.fillStyle(0xFFFFFF,0.85);


        this.add(this.gfx1);
        this.add(this.gfx2);
        this.add(this.gfx3);
        this.add(this.gfx4);
        this.inputVec = new Phaser.Math.Vector2(endx-x, endy-y);
        //this.scene.add.existing(this);
    }


    draw(){

        /*
        if(this.cooldown > 0){
            this.cooldown-=d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
            }
        }
        */


        this.gfx1.lineStyle(10,0x008080,0.85);
        //this.gfx2.lineStyle(10,0x000000,1);

        this.gfx1.beginPath();
        this.gfx1.arc(0,0,40,0,2*Math.PI,false,0.005);
        this.gfx1.closePath();
        this.gfx1.strokePath();

        this.gfx1.beginPath();
        this.gfx1.arc(this.inputVec.x,this.inputVec.y,20,0,2*Math.PI,false,0.005);
        this.gfx1.closePath();
        this.gfx1.strokePath();

        this.gfx2.beginPath();
        this.gfx2.lineBetween(0,0,this.inputVec.x,this.inputVec.y);
        this.gfx2.closePath();
        this.gfx2.strokePath();

        /*
        for(let n = 0; n < this.drawVecs.length; n++){
            this.gfx4.beginPath();
            this.gfx4.slice(this.drawVecs[n].x-this.x,this.drawVecs[n].y-this.y,10,0,360,false,0.005);
            this.gfx4.closePath();
            this.gfx4.fillPath();
        }
        */

    }

    update(t:number, d: number){

        this.gfx1.lineStyle(10,0x008080,0.85);
        //this.gfx2.lineStyle(10,0x000000,1);

        this.gfx1.beginPath();
        this.gfx1.arc(0,0,40,0,2*Math.PI,false,0.005);
        this.gfx1.closePath();
        this.gfx1.strokePath();

        this.gfx1.beginPath();
        this.gfx1.arc(this.inputVec.x,this.inputVec.y,20,0,2*Math.PI,false,0.005);
        this.gfx1.closePath();
        this.gfx1.strokePath();

        this.gfx2.beginPath();
        this.gfx2.lineBetween(0,0,this.inputVec.x,this.inputVec.y);
        this.gfx2.closePath();
        this.gfx2.strokePath();



    }

    hitCheckT(t: Target): boolean{
        this.gfx1.clear();
        this.gfx2.clear();
        this.gfx3.clear();

        this.gfx3.fillStyle(0xFFFFFF,0.85);
        let ovec = new Phaser.Math.Vector2(this.x-t.x,this.y-t.y);
        let a = this.inputVec.dot(this.inputVec);
        let b = 2*ovec.dot(this.inputVec);
        let c = ovec.dot(ovec) - (Math.pow(t.radius,2));
        let disc = Math.pow(b,2) - (4*a*c);
        
        if(disc < 0) {
            this.gfx2.lineStyle(5,0x000000,1);
            return false;
        } else {
            let db = Math.sqrt(disc);

            let dba1 = ((-1*b)-db)/(2*a);
            let dba2 = ((-1*b)+db)/(2*a);

            let n1 = Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2));
            let n2 = Math.sqrt(Math.pow(t.x-this.ex,2)+Math.pow(t.y-this.ey,2));

            let nx = 0;
            let ny = 0;

            if((dba1 >= 0) && (dba1 <= 1)){
                nx = dba1*this.inputVec.x;
                ny = dba1*this.inputVec.y;
                this.gfx3.fillStyle(0xFFFFFF,0.85);
                this.gfx3.beginPath();
                this.gfx3.slice(nx,ny,12,0,360,false,0.005);
                this.gfx3.closePath();
                this.gfx3.fillPath();

                this.gfx2.lineStyle(5,0x00FF00,1);
                if(this.lcount > 0) {
                    console.log("REF: Line: " + "[(Start: "+this.x+","+this.y+")(End: "+this.ex+","+this.ey+")] " + "ADJX: " + nx + " ADJY: " + ny);
                    console.log("REF_2: Target: " + "[X: " + t.x +", Y: "+t.y+"] Vec: [X: "+this.inputVec.x+", Y: "+this.inputVec.y+"]");
                    this.lcount --;
                }
                return true;
            } else if ((dba2 >= 0) && (dba2 <= 1)) {
                nx = dba2*this.inputVec.x;
                ny = dba2*this.inputVec.y;
                this.gfx3.fillStyle(0xFF0000,0.85);
                this.gfx3.beginPath();
                this.gfx3.slice(nx,ny,12,0,360,false,0.005);
                this.gfx3.closePath();
                this.gfx3.fillPath();

                this.gfx2.lineStyle(5,0xFFFF00,1);
                if(this.lcount > 0) {
                    console.log("REF: Line: " + "[(Start: "+this.x+","+this.y+")(End: "+this.ex+","+this.ey+")] " + "ADJX: " + nx + " ADJY: " + ny);
                    console.log("REF_2: Target: " + "[X: " + t.x +", Y: "+t.y+"] Vec: [X: "+this.inputVec.x+", Y: "+this.inputVec.y+"]");
                    this.lcount --;
                }
                return true;
            } else if ((n1 <= t.radius) && (n2 <= t.radius)){
                nx = 0;
                ny = 0;
                this.gfx3.fillStyle(0xFF0000,0.85);
                this.gfx3.beginPath();
                this.gfx3.slice(nx,ny,12,0,360,false,0.005);
                this.gfx3.closePath();
                this.gfx3.fillPath();

                this.gfx2.lineStyle(5,0xFF0000,1);
                if(this.lcount > 0) {
                    console.log("REF: Line: " + "[(Start: "+this.x+","+this.y+")(End: "+this.ex+","+this.ey+")] " + "ADJX: " + nx + " ADJY: " + ny);
                    console.log("REF_2: Target: " + "[X: " + t.x +", Y: "+t.y+"] Vec: [X: "+this.inputVec.x+", Y: "+this.inputVec.y+"]");
                    this.lcount --;
                }
                return true;
            } else {
                this.gfx2.lineStyle(5,0x000000,1);
                return false;
            }


        }
    }

    hitCheckX(t: Target){
        this.gfx1.clear();
        this.gfx2.clear();
        this.gfx3.clear();
        this.gfx3.fillStyle(0xFFFFFF,0.85);
        let ovec = new Phaser.Math.Vector2(this.x-t.x,this.y-t.y);
        let a = this.inputVec.dot(this.inputVec);
        let b = 2*ovec.dot(this.inputVec);
        let c = ovec.dot(ovec) - (Math.pow(t.radius,2));
        let disc = Math.pow(b,2) - (4*a*c);
        
        if(disc < 0) {
            return false;
        } else {
            let db = Math.sqrt(disc);

            let dba1 = ((-1*b)-db)/(2*a);
            let dba2 = ((-1*b)+db)/(2*a);

            let n1 = Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2));
            let n2 = Math.sqrt(Math.pow(t.x-this.ex,2)+Math.pow(t.y-this.ey,2));

            let nx = 0;
            let ny = 0;

            let rp = true;
            if((dba1 >= 0) && (dba1 <= 1)){
                nx = dba1*this.inputVec.x;
                ny = dba1*this.inputVec.y;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ",");
                    //this.hit = true;
                    //this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    this.gfx3.fillStyle(0xFF0000,0.85);
                    this.gfx3.beginPath();
                    this.gfx3.slice(this.x+nx,this.y+ny,12,0,360,false,0.005);
                    this.gfx3.closePath();
                    this.gfx3.fillPath();
                    this.gfx2.lineStyle(5,0x00FF00,1);
                }
                return true;
            } else if ((dba2 >= 0) && (dba2 <= 1)) {
                nx = dba2*this.inputVec.x;
                ny = dba2*this.inputVec.y;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ",");
                    //this.hit = true;
                    //this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    this.gfx3.fillStyle(0xFF0000,0.85);
                    this.gfx3.beginPath();
                    this.gfx3.slice(this.x+nx,this.y+ny,12,0,360,false,0.005);
                    this.gfx3.closePath();
                    this.gfx3.fillPath();
                    this.gfx2.lineStyle(5,0xFFFF00,1);
                }
                return true;
            } else if ((n1 <= t.radius) && (n2 <= t.radius)){
                nx = 0;
                ny = 0;
                //this.hit = true;
                //this.hX = this.pX+nx;
                //this.hY = this.pY+ny;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ">");
                    //this.hit = true;
                    //this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    this.gfx3.fillStyle(0xFF0000,0.85);
                    this.gfx3.beginPath();
                    this.gfx3.slice(this.x+nx,this.y+ny,12,0,360,false,0.005);
                    this.gfx3.closePath();
                    this.gfx3.fillPath();
                    this.gfx2.lineStyle(5,0xFF0000,1);
                }
                return true;
            } else {
                this.gfx2.lineStyle(5,0x000000,1);
                return false;
            }
        }
        
    }
}