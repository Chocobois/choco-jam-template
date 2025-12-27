import { GameScene } from "@/scenes/GameScene";
import { BasicEffect } from "./BasicEffect";
import { TextEffect } from "./TextEffect";
import { EnemyProjectile, EnemyBulletParam } from "./EnemyProjectile";
import { Projectile } from "./Projectile";
import { GibEffect } from "./GibEffect";
interface EnemyType {
    health: number;
    sprite: string; frameData: number[]; anim: boolean;
    sound: string; dieAnim: string; explInfo: number[]; escapeSound: boolean;
    radius: number; useBox: boolean; boxParams: number[];
    vx: number; vy: number; ax: number; ay: number;
    faceAngle: boolean;
    variancex: number;
    variancey: number;
    bounce: boolean; amp: number;
    armor: number[]; shoot: boolean; burst: number; cooldown: number;
    reflect: boolean; reflectAmtX: number; reflectAmtY: number;
    park: boolean; parkX: number; parkVariance: number;
    shotType: number; shootRadius: number; shootSound: string;


}
export class Enemy extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public mySprite: Phaser.GameObjects.Sprite;
    public hpDisplay: Phaser.GameObjects.Rectangle;
    public velocity: number[] = [0,0];
    public health: number = 100;
    public maxHealth: number = 100;
    public hitRadius: number = 10;
    public deleteFlag: boolean = false;
    public projectileTracker: Map<number, number>;
    private hasPlayedSpawnSound: boolean = false;
    public noHitCheck: boolean = true;
    public bounce: boolean = false;
    protected amplitude: number = 1;
    public collidedWithMissile: boolean = false;
    public armor: number [] = [0,0];
    public unSmited: boolean = true;
    public slow: number = 1;
    public slowTimer: number = 0;
    public deadSound: string = "dead_1";
    private burstCounter: number = 0;
    private maxBurst: number = 3;
    protected cooldown: number = 0;
    private maxCooldown: number = 8000;
    private shootRadius: number = 800;
    private burstCooldown: number = 50;
    public myInfo: EnemyType;
    private animTimer: number = 0;
    private curFrame: number = 0;
    protected reflect: boolean = false;
    protected queueReflect: boolean = false;
    protected reflectCounterX: number = 2;
    protected reflectCounterY: number = 2;
    protected offset: number = 0;
    private park: boolean = false;
    private parkX: number = 1600;
    private static HITBOX: number = 1;
    private static HITCIRCLE: number = 0;
    public dmgRes: number = 1;
    public flatRes: number = 1;
    public bleedParams: boolean[] = [false,false];
    public bleedValue: number[] = [0,0,500];
    public boxHeight: number = 0;
    public boxWidth: number = 0;
    public hitMode: number = 0;
    public hBox: Phaser.Geom.Rectangle;
    public hCircle: Phaser.Geom.Rectangle;
    public hasShield: boolean = false;
    public shieldCooldown: number = 0;
    private shotTypes: EnemyBulletParam[] = [
        { //0 - small machine gun bullet
            velocity: 2000,
            explode: false,
            damage: 10,
            sprite: "small_bullet",
            duration: 10000,
            radius: 5,
            critChance: 0.2,
            critDmg: 2.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { // 1 - purple bullet
            velocity: 1500,
            explode: false,
            damage: 15,
            sprite: "purple_bullet",
            duration: 10000,
            radius: 8,
            critChance: 0,
            critDmg: 2.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //2 - missile
            velocity: 2200,
            explode: true,
            damage: 150,
            sprite: "missile",
            duration: 10000,
            radius: 12,
            critChance: 0,
            critDmg: 2.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //3 - fish
            velocity: 500,
            explode: false,
            damage: 275,
            sprite: "fish_small",
            duration: 40000,
            radius: 12,
            critChance: 0,
            critDmg: 2.0,
            useBox: true, boxParams: [64,20],
            spin: false, spinSpeed: 0,
        },
        { //4 - bread
            velocity: 400,
            explode: false,
            damage: 275,
            sprite: "bread_small",
            duration: 40000,
            radius: 12,
            critChance: 0,
            critDmg: 2.0,
            useBox: true, boxParams: [96,36],
            spin: false, spinSpeed: 0,
        },
        { //5 - soccer
            velocity: 1200,
            explode: false,
            damage: 1337,
            sprite: "futbol",
            duration: 20000,
            radius: 414,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 360,
        },
        { //6 - baguette
            velocity: 2000,
            explode: true,
            damage: 666,
            sprite: "baguette",
            duration: 40000,
            radius: 12,
            critChance: 1,
            critDmg: 1.0,
            useBox: true, boxParams: [272,22],
            spin: false, spinSpeed: 0,
        },
        { //7 - small machine gun bullet
            velocity: 1600,
            explode: false,
            damage: 666,
            sprite: "small_bullet",
            duration: 10000,
            radius: 5,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //8 - pan
            velocity: 300,
            explode: false,
            damage: 666,
            sprite: "pan",
            duration: 10000,
            radius: 52,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [10,10],
            spin: false, spinSpeed: 0,
        },
        { //9 - super soccer
            velocity: 1800,
            explode: false,
            damage: 1337,
            sprite: "futbol",
            duration: 20000,
            radius: 414,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 720,
        },
        { //10 - cursed rock
            velocity: 250,
            explode: true,
            damage: 6666,
            sprite: "curse_rock",
            duration: 20000,
            radius: 110,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //11 - rock 1
            velocity: 350,
            explode: false,
            damage: 6666,
            sprite: "rock1",
            duration: 20000,
            radius: 70,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //12 - rock 2
            velocity: 350,
            explode: false,
            damage: 6666,
            sprite: "rock2",
            duration: 20000,
            radius: 70,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //13 - ruby
            velocity: 200,
            explode: false,
            damage: 1337,
            sprite: "ruby",
            duration: 20000,
            radius: 42,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //14 - emerald
            velocity: 200,
            explode: false,
            damage: 1337,
            sprite: "emerald",
            duration: 20000,
            radius: 42,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //15 - diamond
            velocity: 200,
            explode: false,
            damage: 1337,
            sprite: "diamond",
            duration: 20000,
            radius: 42,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //16 - small cursed rock
            velocity: 650,
            explode: true,
            damage: 6666,
            sprite: "small_curse_rock",
            duration: 20000,
            radius: 98,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //17 - turtle 2
            velocity: 350,
            explode: false,
            damage: 1337,
            sprite: "turtle2",
            duration: 20000,
            radius: 40,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //18 - red dice
            velocity: 800,
            explode: false,
            damage: 9999,
            sprite: "dice_red",
            duration: 20000,
            radius: 32,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //19 - med blue bullet
            velocity: 600,
            explode: false,
            damage: 6666,
            sprite: "medblue",
            duration: 20000,
            radius: 15,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //20 - med black bullet
            velocity: 600,
            explode: false,
            damage: 6666,
            sprite: "medblack",
            duration: 20000,
            radius: 15,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //21 - tiny blue bullet
            velocity: 900,
            explode: false,
            damage: 6666,
            sprite: "tinyblue",
            duration: 20000,
            radius: 7,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //22 - tiny black bullet
            velocity: 900,
            explode: false,
            damage: 6666,
            sprite: "tinyblack",
            duration: 20000,
            radius: 7,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: true, spinSpeed: 240,
        },
        { //23 - big feather wh
            velocity: 1200,
            explode: false,
            damage: 6666,
            sprite: "fwhitebig",
            duration: 20000,
            radius: 8,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: false, spinSpeed: 240,
        },
        { //24 - big feather bl
            velocity: 1200,
            explode: false,
            damage: 6666,
            sprite: "fblackbig",
            duration: 20000,
            radius: 8,
            critChance: 1,
            critDmg: 1.0,
            useBox: false, boxParams: [96,36],
            spin: false, spinSpeed: 240,
        },
        
    ]
    private shotIndex: number = 0;

    private types: EnemyType[] = [
        {
            health: 30, //0
            sprite: "enemy_1", frameData: [1,50], anim: false,
            sound: "dead_1", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 100, useBox: false, boxParams: [1,1],
            vx: -300, vy: 0, ax: 0, ay: 0, variancex: -100, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [0,0], shoot: true, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 60, //1
            sprite: "enemy_2", frameData: [1,100], anim: false, escapeSound: true,
            sound: "dead_2", dieAnim: "meme_explosion", explInfo:[18,50],
            radius: 100, useBox: false, boxParams: [1,1],
            vx: -150, vy: 0, ax: 0, ay: 0, variancex: -50, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [30,0], shoot: true, burst: 1, cooldown: 600,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 1, shootRadius: 1000, shootSound: "big_gun_1",
        },
        {
            health: 300, //2
            sprite: "enemy_3", frameData: [1,100], anim: false,
            sound: "dead_1", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 100, useBox: false, boxParams: [1,1],
            vx: -600, vy: 0, ax: 0, ay: 0, variancex: -250, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [40,3], shoot: false, burst: 6, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 1, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 200000, //3
            sprite: "enemy_4", frameData: [1,100], anim: false,
            sound: "dead_3", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 160, useBox: false, boxParams: [1,1],
            vx: -60, vy: 0, ax: 0, ay: 0, variancex: -20, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [50,5], shoot: true, burst: 1, cooldown: 3500,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 2, shootRadius: 1100, shootSound: "missile_sound",
        },
        {
            health: 250, //4
            sprite: "enemy_4", frameData: [1,100], anim: false,
            sound: "dead_1", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 160, useBox: false, boxParams: [1,1],
            vx: -60, vy: 0, ax: 0, ay: 0, variancex: -20, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [40,2], shoot: false, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 500, //5
            sprite: "enemy_5", frameData: [2,50], anim: true,
            sound: "dead_4", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 110, useBox: false, boxParams: [1,1],
            vx: -200, vy: 0, ax: 0, ay: 0, variancex: -70, variancey: 50, faceAngle: false,
            bounce: true, amp: 2, armor: [20,3], shoot: true, burst: 3, cooldown: 8000,
            reflect: true, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 450000, //6 -FINAL BOSS
            sprite: "finalboss", frameData: [2,50], anim: true,
            sound: "dead_4", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 110, useBox: true, boxParams: [336,784],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [20,3], shoot: false, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 800000, //7 -DICE
            sprite: "dice", frameData: [9,50], anim: false,
            sound: "dead_4", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 5, useBox: false, boxParams: [1,1],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 0, armor: [20,3], shoot: false, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 8500, //8 -FLAT EARTH COLLIDER
            sprite: "collider_1", frameData: [2,50], anim: true,
            sound: "dead_5", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 85, useBox: false, boxParams: [1,1],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: true,
            bounce: false, amp: 0, armor: [20,3], shoot: false, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 60, //9 FAST PLANES
            sprite: "enemy_1", frameData: [1,50], anim: false,
            sound: "dead_1", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 100, useBox: false, boxParams: [1,1],
            vx: -900, vy: 0, ax: 0, ay: 0, variancex: -150, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [0,0], shoot: true, burst: 3, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 50000, //10 - big ufos
            sprite: "enemy_4", frameData: [1,100], anim: false,
            sound: "dead_3", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 160, useBox: false, boxParams: [1,1],
            vx: -120, vy: 0, ax: 0, ay: 0, variancex: -30, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [50,5], shoot: true, burst: 1, cooldown: 3500,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 2, shootRadius: 1100, shootSound: "missile_sound",
        },
        {
            health: 2500, //11 - nuke
            sprite: "nuke", frameData: [1,100], anim: false,
            sound: "meme_explosion_sound", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 95, useBox: false, boxParams: [1,1],
            vx: 0, vy: 600, ax: 0, ay: 100, variancex: 0, variancey: 300, faceAngle: true,
            bounce: false, amp: 1, armor: [50,5], shoot: false, burst: 1, cooldown: 3500,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 2, shootRadius: 1100, shootSound: "missile_sound",
        },
        {
            health: 80000, //12 - shield
            sprite: "shield", frameData: [2,100], anim: false,
            sound: "meme_explosion_sound", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 75, useBox: true, boxParams: [18,860],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [50,5], shoot: false, burst: 1, cooldown: 3500,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 2, shootRadius: 1100, shootSound: "missile_sound",
        },
        {
            health: 3000, //13 - mine
            sprite: "mine", frameData: [2,100], anim: false,
            sound: "meme_explosion_sound", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 45, useBox: false, boxParams: [1,1],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [50,5], shoot: false, burst: 1, cooldown: 3500,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 2, shootRadius: 1100, shootSound: "missile_sound",
        },
        {
            health: 18800, //14 RAANDOMWALK
            sprite: "teslacopter", frameData: [2,50], anim: true,
            sound: "dead_6", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 95, useBox: false, boxParams: [1,1],
            vx: -800, vy: 0, ax: 0, ay: 0, variancex: -250, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [40,5], shoot: true, burst: 16, cooldown: 4000,
            reflect: true, reflectAmtX: 99, reflectAmtY: 99,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 50000, //15 CROSSES
            sprite: "enemy_cross_small", frameData: [1,50], anim: false,
            sound: "cross_dead", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 95, useBox: true, boxParams: [60,290],
            vx: 0, vy: 300, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [120,12], shoot: false, burst: 16, cooldown: 4000,
            reflect: true, reflectAmtX: 99, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 100000000, //16 BURNING BUSH
            sprite: "burningbush", frameData: [2,75], anim: true,
            sound: "bushdeath", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 54, useBox: false, boxParams: [60,290],
            vx: -600, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [60,12], shoot: false, burst: 16, cooldown: 4000,
            reflect: false, reflectAmtX: 99, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 100000000, //17 BLASTER
            sprite: "blaster_head", frameData: [2,75], anim: false,
            sound: "unf", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 1, useBox: false, boxParams: [60,290],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [60,12], shoot: false, burst: 16, cooldown: 4000,
            reflect: false, reflectAmtX: 99, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1000, //18 small hero
            sprite: "hsmall", frameData: [2,75], anim: false,
            sound: "unf", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 45, useBox: false, boxParams: [60,290],
            vx: 0, vy: 0, ax: 0, ay: 700, variancex: 0, variancey: 200, faceAngle: false,
            bounce: false, amp: 1, armor: [50,15], shoot: false, burst: 16, cooldown: 4000,
            reflect: false, reflectAmtX: 99, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1000, //19 big hero
            sprite: "hbig", frameData: [2,75], anim: false,
            sound: "unf", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 55, useBox: false, boxParams: [60,290],
            vx: 0, vy: 0, ax: 0, ay: 700, variancex: 0, variancey: 200, faceAngle: false,
            bounce: false, amp: 1, armor: [50,15], shoot: false, burst: 16, cooldown: 4000,
            reflect: false, reflectAmtX: 99, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1000000000000, //20 snail
            sprite: "snailenemy", frameData: [2,75], anim: false,
            sound: "dead_4", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 63, useBox: false, boxParams: [60,290],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [50000,50000], shoot: false, burst: 16, cooldown: 4000,
            reflect: true, reflectAmtX: 999, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1000000000000, //21 trojan
            sprite: "trojan", frameData: [2,75], anim: false,
            sound: "dead_4", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 63, useBox: false, boxParams: [60,290],
            vx: -200, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [50000,50000], shoot: false, burst: 16, cooldown: 4000,
            reflect: true, reflectAmtX: 999, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1000000000000, //22 knight
            sprite: "squire", frameData: [2,75], anim: false,
            sound: "dead_4", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 63, useBox: false, boxParams: [38,166],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [50000,50000], shoot: false, burst: 16, cooldown: 4000,
            reflect: true, reflectAmtX: 999, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1000000000000, //23 turtle
            sprite: "turtle", frameData: [2,75], anim: false,
            sound: "dead_1", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: false,
            radius: 40, useBox: false, boxParams: [60,290],
            vx: 0, vy: 0, ax: 0, ay: 0, variancex: 0, variancey: 0, faceAngle: false,
            bounce: false, amp: 1, armor: [50000,50000], shoot: false, burst: 16, cooldown: 4000,
            reflect: true, reflectAmtX: 999, reflectAmtY: 999,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 700, shootSound: "machinegun",
        },
        {
            health: 1800, //24
            sprite: "enemy_1", frameData: [1,50], anim: false,
            sound: "dead_1", dieAnim: "meme_explosion", explInfo:[18,50], escapeSound: true,
            radius: 100, useBox: false, boxParams: [1,1],
            vx: -300, vy: 0, ax: 0, ay: 0, variancex: -100, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [0,0], shoot: true, burst: 5, cooldown: 8000,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 0, shootRadius: 800, shootSound: "machinegun",
        },
        {
            health: 12000, //25
            sprite: "enemy_2", frameData: [1,100], anim: false, escapeSound: true,
            sound: "dead_2", dieAnim: "meme_explosion", explInfo:[18,50],
            radius: 100, useBox: false, boxParams: [1,1],
            vx: -650, vy: 0, ax: 0, ay: 0, variancex: -250, variancey: 0, faceAngle: false,
            bounce: true, amp: 1, armor: [30,0], shoot: true, burst: 1, cooldown: 400,
            reflect: false, reflectAmtX: 2, reflectAmtY: 200,
            park: false, parkX: 1600, parkVariance: 125,
            shotType: 1, shootRadius: 1000, shootSound: "big_gun_1",
        },
        
    ];


    constructor(scene: GameScene, x: number, y: number, type: number = 0) {
		super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        scene.add.existing(this);
        this.myInfo = this.types[type];
        this.setMovementData();
        this.setCombatData();
        this.setDisplayData();
        this.deleteFlag = false;
	}

    setMovementData(){
        this.velocity = [this.myInfo.vx-this.myInfo.variancex+(Math.trunc(2*Math.random()*this.myInfo.variancex)),
            this.myInfo.vy-this.myInfo.variancey+(Math.trunc(2*Math.random()*this.myInfo.variancey))];
        if(this.myInfo.anim) {
            this.animTimer = this.myInfo.frameData[0];
        }
        this.offset = Math.random()*250;
        this.bounce = this.myInfo.bounce;
        this.amplitude = this.myInfo.amp;
        if(this.myInfo.reflect) {
            this.queueReflect = true;
            this.reflectCounterX = this.myInfo.reflectAmtX;
            this.reflectCounterY = this.myInfo.reflectAmtY;
        }
    }

    setCombatData(){
        this.health = this.myInfo.health;
        this.maxCooldown = this.myInfo.cooldown;
        this.maxBurst = this.myInfo.burst;
        this.shootRadius = this.myInfo.shootRadius;
        this.shotIndex = this.myInfo.shotType;
        this.maxHealth = this.health;
        this.boxHeight = 2*this.myInfo.radius;
        this.boxWidth = 2*this.myInfo.radius;
        this.projectileTracker = new Map();
        this.armor = this.myInfo.armor;
        this.hitRadius = this.myInfo.radius;
        this.deadSound = this.myInfo.sound;
    }

    setDisplayData(){
		this.mySprite = this.scene.add.sprite(0, 0, this.myInfo.sprite);
        this.hpDisplay = this.scene.add.rectangle(-1*(this.mySprite.width/2), (this.mySprite.height/2), this.mySprite.width, 20, 0x00FF00, 0.5);
        this.hpDisplay.setVisible(false);
		this.mySprite.setOrigin(0.5, 0.5);
        this.hpDisplay.setOrigin(0,0);
        this.add(this.mySprite);
        this.add(this.hpDisplay);
    }
    

    cloneEnemyBulletParams(e: EnemyBulletParam){
        return {
            velocity: e.velocity,
            explode: e.explode,
            damage: e.damage,
            sprite: e.sprite,
            duration: e.duration,
            radius: e.radius,
            critChance: e.critChance,
            critDmg: e.critDmg,
            useBox: e.useBox, boxParams: e.boxParams,
            spin: e.spin, spinSpeed: e.spinSpeed,
        }
    }

    hitCheck(p: Projectile, r: number): boolean{
        if(this.noHitCheck) {
            return false;
        }
        if(!this.myInfo.useBox) {
            return (Math.hypot(p.x-this.x, p.y-this.y) < (r + this.myInfo.radius));
        } else {
            return this.boxCollide(p, r);
        }
    }

    boxCollide(p: Projectile, r: number): boolean {
        if((this.angle%180) == 0) {
            return this.checkCardinal(p, r);
        } else if ((this.angle%180) == 90) {
            return this.checkReverseCardinal(p,r);
        }
        let a = Math.atan2(p.y-this.y, p.x-this.x);
        let d = Math.hypot(p.x-this.x, p.y-this.y);
        a -= this.angle*(Math.PI/180);
        let ptr = [d*Math.cos(a), d*Math.sin(a)];

        if(this.boxCheckX(p, Math.abs(ptr[0]), r) && this.boxCheckY(p, Math.abs(ptr[1]), r)) {
            return true;
        } else {
            return false;
        }
    }

    checkCardinal(p: Projectile, r: number): boolean {
        let pd = [Math.abs(p.x-this.x), Math.abs(p.y-this.y)];
        if((pd[0] < (r+this.myInfo.boxParams[0]/2)) && (pd[1] < (r+this.myInfo.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }

    checkReverseCardinal(p: Projectile, r: number): boolean {
        let pd = [Math.abs(p.x-this.x), Math.abs(p.y-this.y)];
        if((pd[1] < (r+this.myInfo.boxParams[0]/2)) && (pd[0] < (r+this.myInfo.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }

    boxCheckX(p: Projectile, n: number, r: number): boolean{
        if((n<(r+this.myInfo.boxParams[0]/2))) {
            return true;
        } else {
            return false;
        }
    }

    boxCheckY(p: Projectile, n: number, r: number): boolean{
        if((n<(r+this.myInfo.boxParams[1]/2))) {
            return true;
        } else {
            return false;
        }
    }

    takeDamage(dmg: number): boolean{
        if(this.deleteFlag || this.noHitCheck) {
            return false;
        }
        this.health -= dmg;

        if(this.health <= 0) {
            this.die();
        }
        return true;
    }

    calcBleed(d:number,t:number){
        if(this.deleteFlag || this.noHitCheck) {
            return false;
        }
        if(this.bleedParams[0]) {
            if(this.bleedParams[1]) {
                this.health -= Math.round(this.bleedValue[0]);
                this.bleedParams[1] = false;
                this.bleedValue[1] = this.bleedValue[2];
                let dx = this.x-(0.325*this.mySprite.width)+(Math.random()*(0.75*this.mySprite.width));
                let dy = this.y-(0.325*this.mySprite.height)+(Math.random()*(0.75*this.mySprite.height))
                //this.scene.addHitEffect(new BasicEffect(this.scene, "hit_spark", dx, dy, 3, 50, false, 0, 0, 1));
                //this.scene.addTextEffect(new TextEffect(this.scene, dx-30+(Math.random()*60), dy-50+(Math.random()*100), Math.round(this.bleedValue[0])+"", "red", 50));
            } else {
                this.bleedValue[1] -= d;
                if(this.bleedValue[1] <= 0){
                    this.bleedValue[1] = 0;
                    this.bleedParams[1] = true;
                }
            }

        }
    }

    takePierceDamage(dmg: number, pID: number, pierceCD: number): boolean {
        if(this.deleteFlag || this.noHitCheck){
            return false;
        }
        if(!this.projectileTracker.has(pID)){
            this.health -= dmg;
            this.projectileTracker.set(pID, pierceCD);
            if(this.health <= 0) {
                this.die();
            }
            return true;
        } else if(this.projectileTracker.get(pID)! == 0) {
            this.health -= dmg;
            this.projectileTracker.set(pID, pierceCD);
            if(this.health <= 0) {
                this.die();
            }
            return true;
        } else {
            //this.health -= dmg;
            if(this.health <= 0) {
                this.die();
            }
            return false;
        }

    }

    update(d: number, t: number){
        this.updateMovement(d,t);
        this.updateAnims(d);
        this.updateProjectileTracker(d);
        if(this.myInfo.shoot) {
            this.updateShootingCycle(d);
        }
        this.updateAngle();
        this.updateSpawnCheck();
        this.updateHealthDisplay(d);
        this.updateBounds();
        if(this.shieldCooldown > 0) {
            this.shieldCooldown -= d;
        }

        this.calcBleed(d,t);
    }

    protected updateAngle(){
        if(this.myInfo.faceAngle) {
            this.mySprite.setAngle(Math.atan2(this.velocity[1],this.velocity[0])*(180/Math.PI));
        }
    }

    updateSpawnCheck(){
        if(this.noHitCheck && (this.x < (1980+0))){
            this.noHitCheck = false;
        }
        if(!this.hasPlayedSpawnSound && this.x < 2080) {
            this.scene.sound.play("spawn", {volume: 0.25});
            this.hasPlayedSpawnSound = true;
        }
    }

    updateBounds(){
        if ((this.x > 2480)){
            this.despawn();
        } else if ((this.y > 1380) || (this.y < -300)){
            this.despawn();
        } else if ((this.x < -300)) {
            if(this.myInfo.escapeSound) {
                this.scene.sound.play("escape");
            }
            this.despawn();
        }
    }

    updateMovement(d: number, t: number){
        this.x += (this.slow*this.velocity[0])*d/1000;
        this.y += (this.slow*this.velocity[1])*d/1000;
        this.velocity[0] += this.myInfo.ax * (d/1000);
        this.velocity[1] += this.myInfo.ay * (d/1000);

        if(this.bounce){
            this.y += this.slow*this.amplitude*4*Math.sin((this.offset+t)/250);
        }
        if(this.slowTimer > 0) {
            this.slowTimer -= d;
            if(this.slowTimer <= 0) {
                this.slowTimer = 0;
                this.slow = 1;
            }
        }
        this.handleReflect();
    }

    handleReflect(){
        if(this.queueReflect) {
            if(this.x < (1920-this.mySprite.width)) {
                this.reflect = true;
                this.queueReflect = false;
            }
        }
        if((this.reflect != true)) {
            return;
        }
        if((this.reflectCounterX > 0)) {
            if (this.x < (0 + this.mySprite.width/2)) {
                if(this.velocity[0] < 0) {
                    this.velocity[0] *= -1;
                    this.mySprite.setScale(-1,1);
                    this.reflectCounterX--;
                }
            }
            if (this.x > (1920 - this.mySprite.width/2)) {
                if(this.velocity[0] > 0) {
                    this.velocity[0] *= -1;
                    this.mySprite.setScale(1,1);
                    this.reflectCounterX--;
                }
            }
        }

        if(this.reflectCounterY > 0) {
            if (this.y < (0 + this.mySprite.height/2)) {
                if(this.velocity[1] < 0) {
                    this.velocity[1] *= -1;
                    this.reflectCounterY--;
                }
            }
            if (this.y > (1080 - this.mySprite.height/2)) {
                if(this.velocity[1] > 0) {
                    this.velocity[1] *= -1;
                    this.reflectCounterY--;
                }
            }
        }


    }

    updateAnims(d: number) {
        if(!this.myInfo.anim) {
            return;
        }

        if(this.animTimer > 0) {
            this.animTimer -= d;
            if(this.animTimer <= 0) {
                this.curFrame++;
                if((this.curFrame > (this.myInfo.frameData[0] - 1))) {
                    this.curFrame = 0;
                }
                this.mySprite.setFrame(this.curFrame);
                this.animTimer = this.myInfo.frameData[1];
            }
        }

    }

    updateShootingCycle(d: number){
        if(this.x < 0) {
            return;
        }
        /*
        if((Math.hypot(this.x-this.scene.activeTurret.x, this.y-this.scene.activeTurret.y) < (this.shootRadius))){
            if(this.cooldown > 0) {
                this.cooldown -= d;
            }
            if(this.cooldown <= 0) {
                if(this.burstCounter == 0) {
                    this.burstCounter = this.maxBurst;
                }
                if(this.burstCounter > 0) {
                    let sAngle = Math.atan2((this.scene.activeTurret.y-this.y),(this.scene.activeTurret.x-this.x));
                    this.scene.sound.play(this.myInfo.shootSound);
                    this.scene.addEnemyProjectile(new EnemyProjectile(this.scene, this.x, this.y, sAngle, this.cloneEnemyBulletParams(this.shotTypes[this.shotIndex])));
                    this.burstCounter--;
                    if(this.burstCounter > 0)
                    {
                        this.cooldown = this.burstCooldown;
                    } else {
                        this.cooldown = this.maxCooldown;
                    }

                }
            }
        }
        */
    }

    updateProjectileTracker(d: number){
        this.collidedWithMissile = false;
        if(this.projectileTracker.size > 0) {
            this.projectileTracker.forEach((value: number, key: number) => {
                if(value > 0) {
                    value -= d;
                    if(value < 0) {
                        value = 0;
                    }
                    this.projectileTracker.set(key, value);
                }
            });
        }
    }

    updateHealthDisplay(d: number){
        if(this.health < this.maxHealth) {
            if(this.health > 0) {
                let sc = this.health/this.maxHealth;
                if((sc <= 0.65) && (sc > 0.3)) {
                    this.hpDisplay.fillColor = 0xFFFF00;
                } else if ((sc <= 0.3)) {
                    this.hpDisplay.fillColor = 0xFF0000;
                } else {
					this.hpDisplay.fillColor = 0x00FF00;
				}
                this.hpDisplay.setVisible(true);
                this.hpDisplay.setScale(sc, 1);
            } else {
                this.hpDisplay.setAlpha(0);
            }
        }
    }

    resetHealthDisplay(){
        this.hpDisplay.setAlpha(1);
        this.hpDisplay.setVisible(false);
    }

    getBulletType(n: number){
        if(n >= this.shotTypes.length) {
            n = 0;
        }
        return this.cloneEnemyBulletParams(this.shotTypes[n]);
    }

    setCurFrame(n: number) {
        this.curFrame = n;
    }

    setAnimTimer(n: number){
        this.animTimer = n;
    }

    die(){
        this.scene.sound.play(this.deadSound, {volume:0.25});

        /*
        this.scene.addHitEffect(new BasicEffect(this.scene, this.myInfo.dieAnim, this.x, this.y, this.myInfo.explInfo[0], this.myInfo.explInfo[1], false, 0));
        this.scene.addTextEffect(new TextEffect(this.scene, 1595-30+(Math.random()*60), 875-30+(Math.random()*60), "+" + this.scene.gameData.addGold(this.maxHealth) +" €", "yellow", 60, true, "white", 800, 100, 0.7, 0));
        this.deleteFlag = true;
        this.scene.trackEnemyKill();
        */
    }



    despawn(){
        this.deleteFlag = true;   
    }

    erase(): string{
        this.deleteFlag = true;
        //this.scene.addHitEffect(new BasicEffect(this.scene, "blue_sparkle", this.x, this.y, 15, 20, false, 0, (Math.random()*360), 1));
        return "SUCCESS";
    }

}
