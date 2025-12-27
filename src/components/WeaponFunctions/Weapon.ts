import { BaseScene } from "@/scenes/BaseScene";
import { WeaponOperator, WeaponParams } from "./WeaponOperator";
//10 upgrade slots
//up to 3, +1 for augmentation
//level goes to 10, + 13 for augmentation



export interface Augment{
    name: string;
    index: number;
    level: number;
    maxlv: number;
    lvcap: number;
    desc: string;

}
export interface WeaponData {
    
    rarity: number;
    type: number;     

}

export class Weapon {

    public scene: BaseScene;
    public active: boolean = false;
    public bursts: number[][];
    public type: number;
    public sprite: string;

    public damage: number;
    public dmod: number = 1;

    public cooldown: number = 0;
    public maxCD: number = 100;

    public pierce: number = -1;
    public pcd: number = -999;
    public pmod: number = 1;

    public augmentTable: Map<string,number> = new Map([]);
    public augmentCaps: number[] = [0,0]//1,3,5,8,10

    public wp: WeaponParams;
//

    public data: WeaponParams;

    public fRad: number = 144;
    //public parser: WeaponOperator;
    public muzzleDist: number;

    public img: string;
    public overflow: number = 0;
    public stored: number = 0;

    public loadTime: number = 0;
    public maxLoad: number = 0;
    public loading: boolean = false;

    public curAmmo: number = 0;
    public maxAmmo: number = 10;




    constructor(scene: BaseScene, wp: WeaponParams){
        this.scene = scene;
        this.type = wp.type;
        this.wp = wp;
        this.damage = wp.dmg;
        this.maxCD = 1000/wp.rof;
        //console.log(this.wp.name + " COOLDOWN: " + this.maxCD);
        this.pierce = wp.pen;
        this.pcd = wp.pcd;
        this.img = ("gun_"+wp.type);

        this.curAmmo = Math.round(wp.clip);
        this.maxAmmo = Math.round(wp.clip);

        this.maxLoad = wp.load*1000;


        this.bursts = [];

    }

    canShoot(): boolean{
        if((this.loading) || (this.cooldown > 0)) {
            return false;
        } else if (this.curAmmo < 1) {
            return false;
        } else {
            return true;
        }
    }

    loadAmmo(){

    }

    reload(){

    }

    update(t:number, d:number){
        if(this.cooldown > 0) { //fixme better overflow tracking, if it gets too close this will gradually just converge to zero
            this.cooldown -= d;
            if(this.cooldown < 0){
                this.overflow = this.cooldown;
                this.cooldown = 0;
            }
        }

        if(this.loading){
            if(this.loadTime > 0){
                this.loadTime -= d;
                if(this.loadTime <= 0){
                    this.scene.sound.play("end_reload", {volume:0.75});
                    this.loadTime = 0;
                    this.loading = false;
                    this.curAmmo = this.maxAmmo;
                }
            }
        }

    }

    updateCooldown(){
        if(Math.abs(this.overflow) < this.maxCD){
            this.cooldown = this.overflow+this.maxCD;
            //console.log(this.wp.name + "CURRENT COOLDOWN: " + this.cooldown);
            this.overflow = 0;
        } else {
            this.handleOverflow();
        }
    }

    updateAmmo(n: number){
        this.curAmmo -= n;
        if(this.curAmmo <= 0){
            this.scene.sound.play("start_reload", {volume:0.75});
            this.loadTime = this.maxLoad;
            this.loading = true;
        }
    }

    handleOverflow(){
        this.overflow = Math.abs(this.overflow);
        if(this.overflow > this.maxCD){
            this.stored += Math.trunc(this.overflow/this.maxCD);
            this.overflow -= this.stored;
            this.cooldown = this.maxCD - this.overflow;
            if(this.cooldown < 0){
                this.cooldown = 0.0001;
            }
            this.overflow = 0;
        }
    }

    reset(){
        this.bursts = [];
        if(this.loadTime > 0) {
            this.loadTime = this.maxLoad;
        }
    }

    fire(){

    }

    upgrade(){

    }

    processAugments(){

    }

}