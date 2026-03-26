import { Target } from "./Target";

export class TileChecker {

    public grid: Map<string,Target[]>;
    public gb: Map<number[], number>;
    public xb: [number,number] = [-200,4200];
    public yb: [number,number] = [-200,3200];
    public xi: [number,number] = [-2, 42];
    public yi: [number,number] = [-2, 32];
    public divider: [number,number] = [100,100];

    constructor(boundx: [number,number], boundy: [number,number], division: [number,number]){
        this.grid = new Map();
        this.gb = new Map();
        this.gb.set([1,1], -3);
        this.xb = boundx;
        this.yb = boundy;
        this.divider = division;
        this.initiateGrid();

    }

    initiateGrid(){
        this.xi[0] = Math.trunc(this.xb[0]/this.divider[0]);
        this.xi[1] = Math.trunc(this.xb[1]/this.divider[1]);

        this.yi[0] = Math.trunc(this.yb[0]/this.divider[0]);
        this.yi[1] = Math.trunc(this.yb[1]/this.divider[1]);

        for(let ix=this.xi[0]; ix<=this.xi[1]; ix++){
            for(let iy=this.yi[0]; iy<=this.yi[1]; iy++){
                this.grid.set("["+ix+","+iy+"]",[]);
            }
        }

        console.log(this.grid.get("["+12+","+12+"]"))

        return;
    }

    clear(){
        this.grid.clear();
        for(let ix=this.xi[0]; ix<=this.xi[1]; ix++){
            for(let iy=this.yi[0]; iy<=this.yi[1]; iy++){
                this.grid.set("["+ix+","+iy+"]",[]);
            }
        }
        return;
    }

    index(t: Target){
        let pp = this.grid.get("["+t.mychunk[0]+","+t.mychunk[1]+"]");
        if(pp != null) {
            pp.push(t);
            this.grid.set("["+t.mychunk[0]+","+t.mychunk[1]+"]",pp);
        } else {
            //console.log("null chunk!" + t.mychunk)
        }
        return;
    }

    fetchAdjacent(t:Target, mode: string): Target[]{
        switch(mode){
            case "0": {
                let pp = this.grid.get("["+t.mychunk[0]+","+t.mychunk[1]+"]");
                if(pp != null) {
                    return pp;
                }
                break;
            }
            case "-y": {
                let pyn = this.grid.get("["+t.mychunk[0]+","+(t.mychunk[1]-1)+"]");
                if(pyn != null) {
                    return pyn;
                }
                break;
            } case "+y": {
                let pyp = this.grid.get("["+t.mychunk[0]+","+(t.mychunk[1]+1)+"]");
                if(pyp != null) {
                    return pyp;
                }
                break;
            } case "-x": {
                let pxn = this.grid.get("["+(t.mychunk[0]-1)+","+t.mychunk[1]+"]");
                if(pxn != null) {
                    return pxn;
                }
                break;
            } case "+x": {
                let pxp = this.grid.get("["+(t.mychunk[0]+1)+","+t.mychunk[1]+"]");;
                if(pxp != null) {
                    return pxp;
                }
                break;
            } case "+x+y": {
                let pxpyp = this.grid.get("["+(t.mychunk[0]+1)+","+(t.mychunk[1]+1)+"]");
                if(pxpyp != null) {
                    return pxpyp;
                }
                break;
            }  case "+x-y": {
                let pxpyn = this.grid.get("["+(t.mychunk[0]+1)+","+(t.mychunk[1]-1)+"]");
                if(pxpyn != null) {
                    return pxpyn;
                }
                break;
            }  case "-x-y": {
                let pxnyn = this.grid.get("["+(t.mychunk[0]-1)+","+(t.mychunk[1]-1)+"]");
                if(pxnyn != null) {
                    return pxnyn;
                }
                break;
            }  case "-x+y": {
                let pxnyp = this.grid.get("["+(t.mychunk[0]-1)+","+(t.mychunk[1]+1)+"]");
                if(pxnyp != null) {
                    return pxnyp;
                }
                break;
            } default: {
                return [];
                break;
            }
        }
        
        return [];
    }
}