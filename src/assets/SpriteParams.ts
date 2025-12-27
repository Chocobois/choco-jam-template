export interface SpriteData{
    name: string;
    frames: number;
    fLen: number;
    loop: boolean;
}

export class SpriteParams{
    public defaultSprite: SpriteData = {name: "meme_explosion", frames: 26, fLen: 50, loop: false};
    public database: Map<string,SpriteData> = new Map();

    constructor(){

    }

    findParams(st: string){
        //let kv = database.get
    }
}