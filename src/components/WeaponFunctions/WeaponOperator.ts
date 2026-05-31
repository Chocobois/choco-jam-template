import { Player } from "../Player"
import { Target } from "../Target";
import { Bullet } from "./Bullet";
import { Augment, Weapon } from "./Weapon";

export interface HitInfo{
    tg: Target;
    vt: Phaser.Math.Vector2;
}

export interface HitLog{
    cooldown: number;
    weaponID: number;
}

export interface DmgStack{
    type: number;
    damage: number;
    curhits: number;
    maxhits: number;
    image: Phaser.GameObjects.Image;
    drawsize: number;
    bop: boolean;
    alpha: number;
    sound: string;
    explode: string;
}

//element: 0 = phys, 1 = fire, 2 = thunder, 3 = poison/acid, 4 = ice, 5 = plasma
export interface WeaponParams{
    type: number; name: string; class: string; dmg: number; spd:number; rof: number; spcd: number; shots: number; pen: number, pcd: number; clip: number; load: number; width: number; rad: number;
    acc: number; arpen: number[]; crit: number[]; ele: number; augs: number[], customaug: Augment;
}

export class WeaponOperator{
    public p: Player;
//stats: per-pellet damage, DoT damage, magazine capacity, movement penalty, pierce, splash, custom, fire rate, reload speed, accuracy cone, critical strike chance
//status damage, armor penetration, direct shot chance, ???recoil, onhit damage,

    public defaultParam: WeaponParams = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
     arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}};
    public database: Map<number,WeaponParams> = new Map;


    constructor(owner:Player){
        this.p=owner;
        this.database = this.p.scene.masterData.gunList;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    }

    getParams(n: number): WeaponParams{

        if(this.database.has(n)){
            let k = this.database.get(n);
            if(k != null) {
                return this.copyParam(k);
            } else {
                return this.copyParam(this.defaultParam);
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + n);
            return this.copyParam(this.defaultParam);
        }
    }

    copyParam(w: WeaponParams): WeaponParams {
        return {
            type:w.type,name:w.name,class:w.class, dmg:w.dmg, spd:w.spd, rof:w.rof, spcd:w.spcd, shots:w.shots, pen:w.pen, pcd:w.pcd, clip:w.clip, load:w.load,
             width:w.width, rad:w.rad, acc:w.acc, arpen:w.arpen, crit:w.crit, ele:w.ele, augs:w.augs, customaug:w.customaug}
    }



    shoot(a:number, w: Weapon, recur: boolean = false, unsafe: boolean = false){
        if(!unsafe){
            if(!w.canShoot()){
                return;
            }
        }

        if(!recur){ //take care of overflow shots
            if(w.stored > 0) {
                let rr = w.stored;
                for(let n = 0; n < rr; n++) {
                    this.shoot(a,w,true,false);
                }
            }
            w.updateCooldown(); //DO NOT MOVE ME - here so it skips cooldown update for extra shots to not make them fail
        } else {
            w.stored -= 1;
        }
        w.updateAmmo(1);
        switch(w.type){
            case 0: { //lutra
                let ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
				this.p.scene.sound.play("gun_0",{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce));
                break;

            } case 1: { //windmill
                let ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
				this.p.scene.sound.play("gun_1",{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce));
                break; 
            } case 3: { //broadhead
                let ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
				this.p.scene.sound.play("gun_3",{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce));
                break; 
            } case 4: { //bjuron
                let ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
				this.p.scene.sound.play("gun_4",{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce));
                break; 
            } case 7: { //ottertail
                let ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
				this.p.scene.sound.play("gun_7",{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce));
                break; 
            } case 2: { //ANTEK
                let ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
				this.p.scene.sound.play("machinegun",{volume: 0.7});
                for(let r = 0; r < w.wp.shots; r++) {
                    ofs = Phaser.Math.DegToRad(-1*w.wp.acc+(Math.random()*2*w.wp.acc));
                    this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce));
                }
                break; 
            } 
            default: {
                break;
            }
        }

    }

    processSpecial(t: Target, wp: number){
        let wr = this.getParams(wp);

        switch(wp){
            case 7: {
                if(t.hasStack(wp)) {
                    let mm = t.stackLog.get(wp);
                    if(mm != null){
                        mm.curhits++;
                        mm.bop = true;
                        mm.drawsize+=0.15;
                    }
                } else {
                    t.addStack(wp, {type: wp, damage: wr.dmg*10, curhits: 1, maxhits: 7, image: this.p.scene.add.image(0,0,"stackcircle"),drawsize: 0.8, bop: false,
                    alpha: 1, sound: "stackexplode", explode:"hit_spark"});
                    //console.log("ADD STACK: ");
                    //console.log(t.stackLog);
                }
                break;
            } default: {
                break;
            }
        }

    }
}