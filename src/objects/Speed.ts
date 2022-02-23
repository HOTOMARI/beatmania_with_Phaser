import Phaser, { Game, Physics } from 'phaser'


export default class Speed extends Phaser.GameObjects.Container {
    public speed!:number
    public time!:number

    constructor(scene: Phaser.Scene, s: number, t: number){
        super(scene, s, t)
        this.speed = s
        this.time = t   
        console.log(`${this.speed},${this.time}`);
           
    }
}