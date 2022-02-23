import Phaser, { Game, Physics } from 'phaser'


export default class Note extends Phaser.GameObjects.Container {
    public tex!:Phaser.GameObjects.Image
    private time!:number
    private line!:number

    constructor(scene: Phaser.Scene, t: number, l: number, speed:number){
        super(scene, t, l)
        this.time = t
        this.line = l

        if(this.line == 1 || this.line == 4){
            this.tex = scene.add.image(102+56.8*this.line, 603-speed*(this.time/1000),'blue').setScale(0.44,0.3)
        }
        else{
            this.tex = scene.add.image(102+56.8*this.line, 603-speed*(this.time/1000),'white').setScale(0.44,0.3)
        }
        
        this.setY(720-900*(this.time/1000))
        
    }

    update(t, dt){
        this.setY(this.tex.y)
    }

    RemovefromScreen(){
        this.tex.y = 9999
        this.y = 9999
    }

    GetTime(){
        return this.time
    }
}