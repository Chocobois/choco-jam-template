//class for continuous-collision projectiles
//these are basically zero-width line segments that extend from prior-> current position and collide with stuff
//PLS call the collision before calling draw or else it will look wonkers

import { GameScene } from "@/scenes/GameScene";
import { Vector } from "matter";
import { Target } from "../Target";
import { BasicEffect } from "../BasicEffect";
import { HitInfo } from "./WeaponOperator";
import { Tracer } from "./Tracer";

export class Bullet extends Phaser.GameObjects.Container{
    public dir: number = 0;

    private dmg: number = 10;
    //prior x/y for hit calculation
    private pX: number;
    private pY: number;

    //rendering x/y for sprite stretching
    private rX: number;
    private rY: number;

    public spr: Phaser.GameObjects.Sprite;


    private r: number;
    private vtheta: number;
    private vx: number;
    private vy: number;

    private maxLen: number = 1200;

    private weaponID: number = 0;

    public trace: boolean = false;
    public tAmt: number = 3;

    public sprAngle: number;
    public hit: boolean = false;
    public hX: number = 0;
    public hY: number = 0;
    public pierce: number = 50;

    public vec: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    public vecT: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    public closest: number = 0;

    public deleteFlag: boolean = false;

    private thits: HitInfo[];

    private a: number = 0;
    public pID: number = 0;

    public sprSc: number[] = [64,64];

    public scene: GameScene;
    constructor(scene:GameScene,x:number,y:number, wp: number, v:number,a:number,dmg: number, pen: number){
        super(scene,x,y);
        this.scene=scene;

        this.weaponID = wp;
        this.pierce = pen;
        this.dmg = dmg;

        this.thits = [];

        this.a = a;

        this.pX = x-(0.1*Math.cos(a));
        this.rX = this.pX;
        this.pY = y-(0.1*Math.sin(a));
        this.rY = this.pY;

        this.vx = v*Math.cos(a);
        this.vy = v*Math.sin(a);

        this.vec.set(this.x-this.pX,this.y-this.pY);

        this.spr = this.scene.add.sprite(0,0,"pbullet");
        this.spr.setOrigin(0.99,0.5);
        this.sprAngle = (360/(2*Math.PI))*a;
        this.spr.setScale(0,0.4);
        this.spr.setAngle(this.sprAngle);
        this.add(this.spr);
        
        this.pID = this.scene.getProjID();
        //add to display done in game for layer reasons

    }

    update(t: number, d: number){
        if(this.hit && (!this.deleteFlag)){
            this.hX = this.x;
            this.hY = this.y;
            this.parseHits();
            this.updateLength();
            if(this.pierce <= 0){
                this.deleteFlag = true;
                return;
            } else {
                this.hit = false;
            }
        }
        this.pX = this.x;
        this.pY = this.y;
        this.x += this.vx*d/1000;
        this.y += this.vy*d/1000;
        this.spr.setAngle(this.sprAngle);
        this.vec.set((this.x-this.pX, this.y-this.pY));
        this.updateLength();
        this.boundCheck();

    }

    updatePos(t: number, d: number){
        this.pX = this.x;
        this.pY = this.y;
        this.x += this.vx*d/1000;
        this.y += this.vy*d/1000;
        this.spr.setAngle(this.sprAngle);
        //this.vec.set(this.x-this.pX, this.y-this.pY);
       // console.log("Vector Set: " +this.vec.x + ", " + this.vec.y);
        this.vec.x = this.x-this.pX;
        this.vec.y = this.y-this.pY;
        //console.log("Vector Fixed: " +this.vec.x + ", " + this.vec.y);
    }

    updateGFX(t: number, d: number){
        if(this.hit && (!this.deleteFlag)){
            this.hX = this.x;
            this.hY = this.y;
            this.parseHits();
            this.updateLength();
            if(this.pierce <= 0){
                this.deleteFlag = true;
                return;
            } else {
                this.updateLength();
                this.hit = false;
            }
        } else {
            this.updateLength();
        }

        this.boundCheck();
    }

    processHits(){
        
    }

    updateLength(){
        let aa = Math.atan2(this.y-this.pY,this.x-this.pX);
        let bb = 0;
        if(this.hit && this.pierce <= 0){
            this.x = this.hX;
            this.y = this.hY;
            bb = Math.sqrt(Math.pow(this.hX-this.rX,2) + Math.pow(this.hY-this.rY,2));

        } else {
            bb = Math.sqrt(Math.pow(this.x-this.rX,2) + Math.pow(this.y-this.rY,2));
        }


        
        if(bb > this.maxLen){
            this.rX = this.x-(this.maxLen*Math.cos(aa));
            this.rY = this.y-(this.maxLen*Math.sin(aa));
            bb = Math.sqrt(Math.pow(this.x-this.rX,2) + Math.pow(this.y-this.rY,2));
        }

        this.spr.setScale((bb/this.sprSc[0]),0.4);

        let r = [];


        if(this.scene.tracing){
            if(this.hit){
                r.push(new Phaser.Math.Vector2(this.hX, this.hY));
            }
            this.scene.addTracer(new Tracer(this.scene, this.pX, this.pY, this.x, this.y, this.hit, r));
        }

    }

    boundCheck(){
        if((this.pX > (3840+this.maxLen)) || (this.pY > (2160+this.maxLen))){
            this.deleteFlag = true;
        } else if ((this.pX < (-3840-this.maxLen)) || (this.pY < (-2160-this.maxLen))){
            this.deleteFlag = true;
        }
    }

    parsePierce(){
        //console.log(this.thits);
        this.thits.sort((a,b)=> (this.getDist(a.vt)-this.getDist(b.vt))); //sort array of hit enemies
        let rp = Math.trunc(this.pierce);
        let rx = this.pierce - rp;


        let base = 0.2;
        let xr = -1;

        for(let n = 0; n < this.thits.length; n++){
            if(rp >= 0){
                this.thits[n].tg.takePierceDamage(this.dmg,this.pID,this.weaponID);
                this.scene.handler.processSpecial(this.thits[n].tg,this.weaponID);
                base += 0.05;
                this.thits[n].tg.hitStun = 20;
                if(Math.random() < 0.5){
                    xr *= -1;
                }
                this.scene.sound.play("oof",{volume:0.2});
                this.scene.addHitEffect(new BasicEffect(this.scene,"splash",this.thits[n].vt.x,this.thits[n].vt.y,4,100,false,0,this.a,[1.75+Math.random()*2.5,xr*(1.25+Math.random()*1.25)]));
                rp--;
                if(rp <= 0) {
                    if(rx > 0){
                        //fractional pierce calculation
                        if(Math.random() < rx) {
                            this.pierce = 1;
                            rx = 0;
                            rp = 1;
                        }
                    } else {
                        this.hX = this.thits[n].vt.x;
                        this.hY = this.thits[n].vt.y;
                        rx = 0;
                        rp = 0;
                        break;
                    }
                }
            }
        }
        this.thits = [];
        this.pierce = rx+rp;
        return;
    }

    parseHits(){
        if((this.thits.length <= 0) || (this.thits.length <= 0)){
            return;
        }
        if(this.pierce > 1){
            this.parsePierce();
        } else {
            let ix = 0;
            let ip = this.getDist(this.thits[0].vt);
            for(let n = 0; n < this.thits.length; n++){
                if(this.getDist(this.thits[n].vt) < ip) {
                    ip = this.getDist(this.thits[n].vt);
                    ix = n;
                }
            }

            this.thits[ix].tg.takeDamage(this.dmg);
            this.scene.handler.processSpecial(this.thits[ix].tg,this.weaponID);
            this.scene.sound.play("oof",{volume:0.2});
            this.thits[ix].tg.hitStun = 20;
            this.hX = this.thits[ix].vt.x;
            this.hY = this.thits[ix].vt.y;

            this.pierce = 0;

            let xr = -1;
            if(Math.random() < 0.5){
                xr *= -1;
            }
            this.scene.addHitEffect(new BasicEffect(this.scene,"splash",this.hX,this.hY,4,100,false,0,this.a,[1.75+Math.random()*2.5,xr*(1.25+Math.random()*1.25)]));

            this.thits = [];
        }
    }

    getDist(v: Phaser.Math.Vector2){
        return Math.sqrt(Math.pow(v.x-this.pX,2)+Math.pow(v.y-this.pY,2));
    }

    hitCheck(t: Target){
        let ovec = new Phaser.Math.Vector2(this.pX-t.x,this.pY-t.y);
        let a = this.vec.dot(this.vec);
        let b = 2*ovec.dot(this.vec);
        let c = ovec.dot(ovec) - (Math.pow(t.radius,2));
        let disc = Math.pow(b,2) - (4*a*c);
        
        if(disc < 0) {
            return false;
        } else {
            let db = Math.sqrt(disc);

            let dba1 = ((-1*b)-db)/(2*a);
            let dba2 = ((-1*b)+db)/(2*a);

            let n1 = Math.sqrt(Math.pow(t.x-this.pX,2)+Math.pow(t.y-this.pY,2));
            let n2 = Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2));

            let nx = 0;
            let ny = 0;

            let rp = t.checkBulletLog(this.pID);
            if((dba1 >= 0) && (dba1 <= 1)){
                nx = dba1*this.vec.x;
                ny = dba1*this.vec.y;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ",");
                    this.hit = true;
                    this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    if(this.scene.tracing){
                        console.log("TEST: Line: " + "[(Start: "+this.pX+","+this.pY+")(End: "+this.x+","+this.y+")] " + "ADJX: " + nx + " ADJY: " + ny);
                        console.log("TEST_2: Target: " + "[X: " + t.x +", Y: "+t.y+"] Vec: [X: "+this.vec.x+", Y: "+this.vec.y+"]");
                        this.scene.dot(this.pX+nx,this.pY+ny);
                    }
                }
                return true;
            } else if ((dba2 >= 0) && (dba2 <= 1)) {
                nx = dba2*this.vec.x;
                ny = dba2*this.vec.y;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ",");
                    this.hit = true;
                    this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    if(this.scene.tracing){
                        console.log("TEST: Line: " + "[(Start: "+this.pX+","+this.pY+")(End: "+this.x+","+this.y+")] " + "ADJX: " + nx + " ADJY: " + ny);
                        console.log("TEST_2: Target: " + "[X: " + t.x +", Y: "+t.y+"] Vec: [X: "+this.vec.x+", Y: "+this.vec.y+"]");
                        this.scene.dot(this.pX+nx,this.pY+ny);
                    }
                }
                return true;
            } else if ((n1 <= t.radius) && (n2 <= t.radius)){
                nx = 0;
                ny = 0;
                this.hit = true;
                //this.hX = this.pX+nx;
                //this.hY = this.pY+ny;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ">");
                    this.hit = true;
                    this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    if(this.scene.tracing){
                        console.log("TEST: Line: " + "[(Start: "+this.pX+","+this.pY+")(End: "+this.x+","+this.y+")] " + "ADJX: " + nx + " ADJY: " + ny);
                        console.log("TEST_2: Target: " + "[X: " + t.x +", Y: "+t.y+"] Vec: [X: "+this.vec.x+", Y: "+this.vec.y+"]");
                        this.scene.dot(this.pX+nx,this.pY+ny);
                    }
                }
                return true;
            } else {
                return false;
            }

        }
        
    }

    limHitCheck(t: Target){
        let ovec = new Phaser.Math.Vector2(this.pX-t.x,this.pY-t.y);
        let a = this.vec.dot(this.vec);
        let b = 2*ovec.dot(this.vec);
        let c = ovec.dot(ovec) - (Math.pow(t.radius,2));
        let disc = Math.pow(b,2) - (4*a*c);
        
        if(disc < 0) {
            return false;
        } else {
            let db = Math.sqrt(disc);

            let dba1 = ((-1*b)-db)/(2*a);
            let dba2 = ((-1*b)+db)/(2*a);

            let n1 = Math.sqrt(Math.pow(t.x-this.pX,2)+Math.pow(t.y-this.pY,2));
            let n2 = Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2));

            let nx = 0;
            let ny = 0;

            let rp = t.checkBulletLog(this.pID);
            if((dba1 >= 0) && (dba1 <= 1)){
                nx = dba1*this.vec.x;
                ny = dba1*this.vec.y;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ",");
                    this.hit = true;
                    this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    this.scene.dot(this.pX+nx,this.pY+ny);
                }
                return true;
            } else if ((dba2 >= 0) && (dba2 <= 1)) {
                nx = dba2*this.vec.x;
                ny = dba2*this.vec.y;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ",");
                    this.hit = true;
                    this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    this.scene.dot(this.pX+nx,this.pY+ny);
                }
                return true;
            } else if ((n1 <= t.radius) && (n2 <= t.radius)){
                nx = 0;
                ny = 0;
                this.hit = true;
                //this.hX = this.pX+nx;
                //this.hY = this.pY+ny;
                if(rp){
                    //console.log("<" + this.pID + ", rp =" + rp + ">");
                    this.hit = true;
                    this.thits.push({tg: t, vt: new Phaser.Math.Vector2(this.pX+nx,this.pY+ny)});
                    this.scene.dot(this.pX+nx,this.pY+ny);
                }
                return true;
            } else {
                return false;
            }


        }
        
    }
}