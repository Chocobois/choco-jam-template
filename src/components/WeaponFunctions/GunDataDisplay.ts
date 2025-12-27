import { BaseScene } from "@/scenes/BaseScene";
import { UpgradeScene } from "@/scenes/UpgradeScene";
import { WeaponEntry } from "./Armory";
import { WeaponParams } from "./WeaponOperator";

export class GunDataDisplay extends Phaser.GameObjects.Container{
    public scene:UpgradeScene;

    private ndisp: Phaser.GameObjects.Text;
    private dmg: Phaser.GameObjects.Text;
    private rof: Phaser.GameObjects.Text;
    private cap: Phaser.GameObjects.Text;
    private reload: Phaser.GameObjects.Text;
    private pierce: Phaser.GameObjects.Text;
    private acc: Phaser.GameObjects.Text;
    private crit: Phaser.GameObjects.Text;
    private arpen: Phaser.GameObjects.Text;

    private sp: number = 48;

    private wrap: number = 472;

    constructor(scene:UpgradeScene,x:number,y:number){
        super(scene,x,y);
        this.scene=scene;

        this.ndisp = this.scene.addText({
			x: 0, y: 0, size: 40, color: "#FFFFFF", text: "",
		});
        this.ndisp.setWordWrapWidth(this.wrap);
        this.add(this.ndisp);

        this.dmg = this.scene.addText({
			x: 0, y: 70+0*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.dmg.setWordWrapWidth(this.wrap);
        this.add(this.dmg);

        this.rof = this.scene.addText({
			x: 0, y: 70+1*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.rof.setWordWrapWidth(this.wrap);
        this.add(this.rof);

        this.cap = this.scene.addText({
			x: 0, y: 70+2*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.cap.setWordWrapWidth(this.wrap);
        this.add(this.cap);

        this.reload = this.scene.addText({
			x: 0, y: 70+3*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.reload.setWordWrapWidth(this.wrap);
        this.add(this.reload);

        this.pierce = this.scene.addText({
			x: 0, y: 70+4*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.pierce.setWordWrapWidth(this.wrap);
        this.add(this.pierce);

        this.acc = this.scene.addText({
			x: 0, y: 70+5*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.acc.setWordWrapWidth(this.wrap);
        this.add(this.acc);

        this.crit = this.scene.addText({
			x: 0, y: 70+6*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.crit.setWordWrapWidth(this.wrap);
        this.add(this.crit);

        this.arpen = this.scene.addText({
			x: 0, y: 70+7*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.arpen.setWordWrapWidth(this.wrap);
        this.add(this.arpen);

    }



    redraw(i: number){
        let e = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
        arpen: [0,0], crit: [0,1], ele: 1, augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}};

        if(this.scene.masterData.gunList.has(i)){
            e = this.scene.masterData.gunList.get(i)!;
        }

        this.ndisp.setText(e.name);
        if(e.shots == 1){
            this.dmg.setText("Damage: " + (e.dmg).toFixed(2));
        } else {
            this.dmg.setText("Damage: " + (e.dmg*e.shots).toFixed(2) + " ("+(e.dmg).toFixed(2) + " x " + e.shots + ")");
        }

        this.rof.setText("Cycle Rate: " + (e.rof).toFixed(2) + " per second");
        this.cap.setText("Capacity: " + e.clip);
        this.reload.setText("Reload Time: " + (e.load).toFixed(2) + " seconds");
        this.pierce.setText("Pierce: " + (e.pen).toFixed(2));
        this.acc.setText("Accuracy Cone: " + (2*e.acc).toFixed(2) + " degrees");
        this.crit.setText("Crit Chance/Damage: " + e.crit[0] + "% / " + (100*e.crit[1]).toFixed(2) + "%");
        this.arpen.setText("Armor Penetration: " + e.arpen[0] + " / " + e.arpen[1] + "%");
   
    }
}