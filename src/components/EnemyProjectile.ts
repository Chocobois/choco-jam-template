import { GameScene } from "@/scenes/GameScene";
import { Enemy } from "./Enemy";
import { BasicEffect } from "./BasicEffect";
//import { TurretParams } from "./PowerUpHandler";
import { TextEffect } from "./TextEffect";

import { Player } from "./Player";
//import { Turret } from "./Turret";

export interface EnemyBulletParam{
    velocity: number;
    explode: boolean;
    damage: number;
    sprite: string;
    duration: number;
    radius: number;
    critChance: number;
    critDmg: number;
    useBox: boolean; boxParams: number[];
    spin: boolean; spinSpeed: number;
}

export class EnemyProjectile extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public mySprite: Phaser.GameObjects.Image;
    public velocity: number[] = [0,0];
    public deleteFlag: boolean = false;
    public projectileID: number;
    public gravity: boolean = false;
    public radius: number =  10;
    public duration: number = 10000;
    //public angle: number;
    public info: EnemyBulletParam;
    public didCrit: boolean = false;
    public myDmg: number = 0;
    public pierce: boolean = false;
    public hasHit: boolean = false;
    private collider = false;

    constructor(scene: GameScene, x: number, y: number, angle: number, info: EnemyBulletParam, shouldPierce: boolean = false, collider = false) {
		super(scene, x, y);
        this.scene = scene;
        //this.angle = angle;
        this.info = info;
        this.velocity = [this.info.velocity*(Math.cos(angle)), this.info.velocity*(Math.sin(angle))];
        this.x = x;
        this.y = y;
		this.mySprite = this.scene.add.image(0, 0, this.info.sprite);
		this.mySprite.setOrigin(0.5, 0.5);
       // this.mySprite.setAngle((180/Math.PI)*this.angle);
        this.add(this.mySprite);
        this.setAngle(angle*(180/Math.PI));
		scene.add.existing(this);
        this.duration = this.info.duration;
        this.pierce = shouldPierce;
        this.collider = collider;
	}

    update(d: number){
        this.x += (d*this.velocity[0]/1000);
        this.y += (d*this.velocity[1]/1000);
        this.duration -= d;
        if(this.info.spin) {
            this.angle += (this.info.spinSpeed*d/1000);
            if(this.angle > 360) {
                this.angle -= 360;
            } else if (this.angle < -360) {
                this.angle += 360;
            }
            this.setAngle(this.angle);
        }
        this.didCrit = false;
        this.myDmg = 0;

        if(this.duration <= 0) {
            this.die();
        }
        if ((this.x > (2380+this.mySprite.width/2)) || (this.x < (-300-this.mySprite.width/2))){
            this.die();
        } else if ((this.y > (1380+this.mySprite.height/2)) || (this.y < (-300-this.mySprite.height/2))){
            this.die();
        }

    }

    /*
    hitCheck(target: Turret): boolean {
        if(this.hasHit) {
            return false;
        }
        if(!this.info.useBox) {
            return (Math.hypot(this.x-target.x, this.y-target.y) < (this.info.radius+target.radius));
        } else {
            return this.boxCollide(this.scene.activeTurret);
        }
    }
    */

    /*
    boxCollide(t: Turret): boolean {
        if((this.angle%180) == 0) {
            return this.checkCardinal(t);
        } else if ((this.angle%180) == 90) {
            return this.checkReverseCardinal(t);
        }
        let a = Math.atan2(t.y-this.y, t.x-this.x);
        let d = Math.hypot(t.x-this.x, t.y-this.y);
        a -= this.angle*(Math.PI/180);
        let ptr = [d*Math.cos(a), d*Math.sin(a)];

        if(this.boxCheckX(t, Math.abs(ptr[0])) && this.boxCheckY(t, Math.abs(ptr[1]))) {
            return true;
        } else {
            return false;
        }
    }
    */

    checkCardinal(p: Player): boolean {
        let pd = [Math.abs(p.x-this.x), Math.abs(p.y-this.y)];
        if((pd[0] < (p.radius+this.info.boxParams[0]/2)) && (pd[1] < (p.radius+this.info.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }

    checkReverseCardinal(p: Player): boolean {
        let pd = [Math.abs(p.x-this.x), Math.abs(p.y-this.y)];
        if((pd[1] < (p.radius+this.info.boxParams[0]/2)) && (pd[0] < (p.radius+this.info.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }

    boxCheckX(p: Player, n: number): boolean{
        if((n<(p.radius+this.info.boxParams[0]/2))) {
            return true;
        } else {
            return false;
        }
    }

    boxCheckY(p: Player, n: number): boolean{
        if((n<(p.radius+this.info.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }

    handleCollisionEffects(){
        /*
        if(this.myDmg < 1) {
            return;
        }
        if(this.info.explode) {
            this.scene.sound.play("meme_explosion_sound", {volume:0.25});
            this.scene.addHitEffect(new BasicEffect(this.scene, "meme_explosion", this.x, this.y, 18, 50, false, 0, Math.random()*360, 1));
        } else {
            this.scene.addHitEffect(new BasicEffect(this.scene, "hit_spark", this.x, this.y, 3, 50, false, 0, Math.random()*360, 1));
        }

        if(this.didCrit) {
            this.scene.sound.play("crit", {volume:0.15});
            this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(this.myDmg)+" !", "aqua", 75, true, "fuchsia"));
        } else {
            this.scene.sound.play("turret_hit",{volume:0.25});
            this.scene.addTextEffect(new TextEffect(this.scene, this.x-30+(Math.random()*60), this.y-50+(Math.random()*100), Math.round(this.myDmg)+"", "red", 60));
        }
        */
    }

    collide(target: Player){
        /*
        if(this.hitCheck(target) && (!this.deleteFlag)) {
            let n = 0;
            n = this.calculateCrit(this.info.damage);
            target.takeDamage(n);
            this.hasHit = true;
            this.myDmg += n;
            if(!this.pierce){
                this.die();
            }
        }
        */
    }

    calculateCrit(dmg: number): number{
        if((Math.random() < this.info.critChance)) {
            this.didCrit = true;
            return this.info.critDmg*dmg;
        }
        return dmg;
    }

    die(){
        this.deleteFlag = true;
        this.mySprite.setVisible(false);
    }

    tCollide(e:Enemy, r:number) {
        if(!this.collider) {
            return;
        }
        if(Math.hypot(e.x-this.x,e.y-this.y) < (this.radius+r)) {
            this.eat();
        }
    }

    eat(){
        this.deleteFlag = true;
        //this.scene.addHitEffect(new BasicEffect(this.scene, "meme_explosion", this.x,this.y,18,50,false,0,Math.random()*360,(this.mySprite.width)/200));
        this.scene.sound.play("eat",{volume: 1});
    }

    erase(){
        this.deleteFlag = true;
        //this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
    }

}
