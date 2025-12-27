import { Armory, WeaponEntry } from "./WeaponFunctions/Armory";
import { WeaponParams } from "./WeaponFunctions/WeaponOperator";
import { Augment } from "./WeaponFunctions/Weapon";

export class GlobalVariables {


    public curGunID: number = -999999999;
    public inv: Armory;
    public defaultParam: WeaponParams = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
     arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}};


    public augList: Augment[] = [
        {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
        {name: "Impact", index: 1, level: 0, maxlv: 10, lvcap: 10, desc: "Increased base damage."}, //base damage, +10% each
        {name: "Barrage", index: 2, level: 0, maxlv: 10, lvcap: 10, desc: "Increased rate of fire."}, //RoF, +10% each
        {name: "Magazine", index: 3, level: 0, maxlv: 10, lvcap: 10, desc: "Additional magazine capacity."}, //Capacity, +10% each
        {name: "Swiftload", index: 4, level: 0, maxlv: 10, lvcap: 10, desc: "Reduced reload speed."}, //Reload, -5% each
        {name: "Melter", index: 5, level: 0, maxlv: 10, lvcap: 10, desc: "Additional damage over time."}, //DoT damage, +10% each
        {name: "Flaying", index: 6, level: 0, maxlv: 10, lvcap: 10, desc: "Ignores a portion of resistances."}, //Armor pen, +5% each
        {name: "Razor Shot", index: 7, level: 0, maxlv: 10, lvcap: 10, desc: "Increased on-hit damage."}, //On hit damage, +10% each
        {name: "Demolition", index: 8, level: 0, maxlv: 10, lvcap: 10, desc: "Enlarged blast radius."}, //Blast radius, +5% each
        {name: "Penetrator", index: 9, level: 0, maxlv: 10, lvcap: 10, desc: "Increases penetration capability."}, //Pierce, +10% each
        {name: "Concentration", index: 10, level: 0, maxlv: 10, lvcap: 10, desc: "Narrowed accuracy cone."}, //Accuracy cone, -5% each
        {name: "Critical Eye", index: 11, level: 0, maxlv: 10, lvcap: 10, desc: "Additional base critical hit chance."}, //Crit chance, +2.5% each
        {name: "Merciless", index: 12, level: 0, maxlv: 10, lvcap: 10, desc: "Increased critical hit damage."}, //Crit damage, +10% each
        {name: "Trickshot", index: 13, level: 0, maxlv: 10, lvcap: 10, desc: "Additional direct hit chance."}, //Direct shot (+50% dmg) chance, +5% each
        {name: "Focus", index: 14, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot recharge and rate of fire."}, //Special ammo recharge rate and RoF, +10% each
        {name: "Tactician", index: 15, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot damage."}, //Special ammo damage, +10% each
        {name: "Power Assist", index: 16, level: 0, maxlv: 10, lvcap: 10, desc: "Reduced movement penalty."}, //reduces movement penalty, -5% each
        {name: "Slayer", index: 17, level: 0, maxlv: 10, lvcap: 10, desc: "Increased damage to bosses and elite enemies."}, //Boss and elite damage, +2.5% each
        {name: "CUSTOM", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""},

    ];


    public gunList: Map<number,WeaponParams> = new Map([
        //starting weps
        [0, {type:0,name:"Lutra",class:"pistol", dmg: 125, spd: 20000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: 20, clip: 18, load: 1.5, width: 1, rad: 1,
         acc: 2, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
        [1, {type:1,name:"Windmill",class:"smg", dmg: 110, spd: 20000, rof: 8, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 32, load: 1.5, width: 1, rad: 1,
         acc: 7.5, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
        [2, {type:2,name:"ANTIK",class:"shotgun", dmg: 90, spd: 20000, rof: 2.5, spcd: 10000, shots: 6, pen: 1, pcd: -999, clip: 8, load: 2.5, width: 1, rad: 1,
         acc: 15, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
        
        [3, {type:3,name:"Broadhead",class:"sniper", dmg: 765, spd: 50000, rof: 1.5, spcd: 10000, shots: 1, pen: 5, pcd: -999, clip: 5, load: 1.75, width: 1, rad: 100,
         acc: 0, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
        [4, {type:4,name:"BJURÖN",class:"assault", dmg: 175, spd: 28000, rof: 6, spcd: 10000, shots: 1, pen: 2, pcd: -999, clip: 40, load: 2, width: 1, rad: 1,
         acc: 4, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
        [5, {type:5,name:"Mako",class:"lmg", dmg: 215, spd: 28000, rof: 7.5, spcd: 10000, shots: 1, pen: 3, pcd: -999, clip: 5, load: 3.5, rad: 1,
         width: 1, acc: 15, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
        [6, {type:6,name:"LOSSNEN",class:"rocket", dmg: 1125, spd: 28000, rof: 0.5, spcd: 10000, shots: 6, pen: 3, pcd: -999, clip: 5, load: 3.5, width: 20, rad: 1,
         acc: 15, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],

        [7, {type:7,name:"Ottertail",class:"smg", dmg: 185, spd: 22000, rof: 12, spcd: 10000, shots: 1, pen: 2, pcd: -999, clip: 42, load: 1.75, width: 1, rad: 1,
         acc: 9, arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}}],
 
    ]);

    public side: WeaponEntry;
    public primary: WeaponEntry;
    public secondary: WeaponEntry;

    constructor(){
        this.inv = new Armory();
        this.side = this.inv.fetchGun(-999999999);
        this.primary = this.inv.fetchGun(-999999998);
        this.secondary = this.inv.fetchGun(-999999997);

    }

    getParams(n: number): WeaponParams{

        if(this.gunList.has(n)){
            let k = this.gunList.get(n);
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

    getGunID(): number{
        this.curGunID++;
        if(this.curGunID > 999999999) {
            this.curGunID = -999999999
        }
        return this.curGunID;
    }
}