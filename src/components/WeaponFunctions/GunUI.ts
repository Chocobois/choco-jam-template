import { GameScene } from "@/scenes/GameScene";

export class GunUI extends Phaser.GameObjects.Container{

    public scene:GameScene;
    private panel:Phaser.GameObjects.Image;
    private gun:Phaser.GameObjects.Image;

    private barLine: Phaser.GameObjects.Rectangle;
    private barBack: Phaser.GameObjects.Rectangle;
    private title: Phaser.GameObjects.Text;
    private counter: Phaser.GameObjects.Text;

    private offsets: number[];
    constructor(scene:GameScene,x:number,y:number, offsets: number[]){
        super(scene,x,y);
        this.offsets = offsets;
        this.scene = scene;
        this.panel = this.scene.add.image(0,0,"panelred");
        this.add(this.panel);
        this.panel.setOrigin(0.5,0.5)
        this.panel.setDepth(1);
        this.gun = this.scene.add.image(0,7,("gun_"+this.scene.player.getActiveWeapon().type));
        this.add(this.gun);
        this.gun.setDepth(10);
        this.gun.setOrigin(0.5,0.5);

        this.title = this.scene.addText({
			x: -330,
			y: -81,
			size: 45,
			color: "#FFFFFF",
			text: this.scene.player.getActiveWeapon().wp.name,
		});
        this.add(this.title);
        this.title.setOrigin(0,0.5)
        this.title.setDepth(11);
        this.title.setAlpha(0);

        this.counter = this.scene.addText({
			x: 80,
			y: 60,
			size: 30,
			color: "#FFFF00",
			text: this.scene.player.getActiveWeapon().curAmmo + "/" + this.scene.player.getActiveWeapon().maxAmmo,
		});
        this.add(this.counter);
        this.title.setDepth(12);

        this.barBack = this.scene.add.rectangle(-200,81,400,20,0x000000,0.75);
        this.barBack.setOrigin(0,0.5);
        this.add(this.barBack);
        this.barBack.setDepth(13);

        this.barLine = this.scene.add.rectangle(-200,81,400,20,0x00FF00,0.75);
        this.barLine.setOrigin(0,0.5);
        this.add(this.barLine);
        this.barLine.setDepth(14);


    }

    update(t:number,d:number){
        this.x = this.scene.player.x + this.offsets[0];
        this.y = this.scene.player.y + this.offsets[1];
        let rn = this.scene.player.getActiveWeapon();
        this.counter.setText(rn.curAmmo + " / " + rn.maxAmmo);

        if(rn.loadTime > 0) {
            this.counter.setVisible(false);
            this.barLine.setVisible(true);
            this.barBack.setVisible(true);
            this.barLine.setScale(rn.loadTime/rn.maxLoad,1);
        } else {
            this.counter.setVisible(true);
            this.barLine.setVisible(false);
            this.barBack.setVisible(false);
        }
    }

    refresh(){
        let rt = this.scene.player.getActiveWeapon();
        this.gun.setTexture("gun_"+rt.type);
        this.title.setText(rt.wp.name);
        this.counter.setText(rt.curAmmo + "/" + rt.maxAmmo);
        this.barLine.setScale(rt.loadTime/rt.maxLoad,1);
        if(rt.loadTime > 0) {
            this.counter.setVisible(false);
        } else {
            this.counter.setVisible(true);
            this.barLine.setVisible(false);
            this.barBack.setVisible(false);
        }
    }


}