import { Augment, Weapon } from "./Weapon";
import { WeaponSlot } from "./WeaponSlot";

export interface WeaponEntry{
    gID: number;
    wID: number;
    augs: Augment[];
}


export class Armory {
    public wlist: WeaponSlot[]; // do not push

    public gunList: Map<number,WeaponEntry>;

    constructor() {
        this.gunList = new Map([
            [-999999999, {gID: -999999999, wID: 0, augs: [{name: "Impact", index: 1, level: 5, maxlv: 8, lvcap: 10, desc: "Increased base damage."}]}],
            [-999999998, {gID: -999999998, wID: 1, augs: []}],
            [-999999997, {gID: -999999997, wID: 2, augs: [{name: "Impact", index: 1, level: 12, maxlv: 13, lvcap: 13, desc: "Increased base damage."},
                {name: "Barrage", index: 2, level: 8, maxlv: 10, lvcap: 10, desc: "Increased rate of fire."},    
                {name: "Penetrator", index: 9, level: 6, maxlv: 8, lvcap: 10, desc: "Increases penetration capability."},
                {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}]}],//keep these three defaults the same

            [-999999996, {gID: -999999996, wID: 3, augs: []}],
            [-999999995, {gID: -999999995, wID: 4, augs: []}],
            [-999999994, {gID: -999999994, wID: 2, augs: []}],
        ]);
    }
    
    updateAug(id: number, index: number, ref: Augment){
        if(this.gunList.has(id)) {
            this.gunList.get(id)!.augs[index] = this.copyAug(ref);
        } else {
            console.log("INVALID GUN FETCH ID: " + id);
            return;
        }
    }

    fetchGun(id: number): WeaponEntry{
        if(this.gunList.has(id)){
            if(this.gunList.get(id) != null){
                return this.copy(this.gunList.get(id)!);
            } else {
                console.log("NULL ENTRY IN GUN LIST: " + id);
                return {gID: -999999999, wID: 0, augs: []};
            }
        } else {
            console.log("INVALID GUN FETCH ID: " + id);
            return {gID: -999999999, wID: 0, augs: []};
        }
        /*
        for(let n = 0; n < this.myGuns.length; n++){
            if(this.myGuns[n].gID == id){
                return this.copy(this.myGuns[n]);
            }
        }
        console.log("INVALID GUN FETCH ID: " + id);
        return {gID: -999999999, wID: 0, augs: []};
        */
       
    }

    copy(w: WeaponEntry): WeaponEntry{
        return {
            gID: w.gID,
            wID: w.wID,
            augs: w.augs,
        }
    }

    copyAug(a: Augment): Augment{
        return {
           name: a.name,
           index: a.index,
           level: a.level,
           maxlv: a.maxlv,
           lvcap: a.lvcap,
           desc: a.desc, 
        }
    }
}