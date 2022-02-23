import Phaser, { Scene } from "phaser";

export default class Title extends Phaser.Scene
{
    private cursor!:Phaser.Types.Input.Keyboard.CursorKeys
    private background!:Phaser.GameObjects.TileSprite
    private Text!:Phaser.GameObjects.Text
    private initialTime = 0
    private TimeChk!: boolean
    private Start!: boolean
    private Music!:Phaser.Sound.BaseSound
    private Se!:Phaser.Sound.BaseSound

    constructor() {
		super('Title')
	}
    
    init(){
        this.TimeChk = false
        this.Start = false
    }

    create(){
        this.Se = this.sound.add('se_changescene')
        this.Music = this.sound.add('bgm_title')

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        this.background = this.add.tileSprite(0,0,1280,720,'bg_main').setOrigin(0)
        this.add.image(screenCenterX,screenCenterY,'title')
        this.Text = this.add.text(screenCenterX,600,
            " PRESS SPACEBAR ",{fontFamily: 'font3', fontSize:'60px', shadow:{blur:15, fill:true}
        }).setOrigin(0.5)
        this.cursor = this.input.keyboard.createCursorKeys()
    }

    update(t,dt){
        this.background.tilePositionX+=(50*(dt/1000))

        if(!this.TimeChk){
            this.initialTime = this.time.now
            this.TimeChk = true
            this.Music.play()
        }
        
        if(!this.Start){
            if(this.time.now - this.initialTime >= 600){
                this.Text.setVisible(!this.Text.visible)
                this.initialTime = this.time.now
            }
            if(Phaser.Input.Keyboard.JustDown(this.cursor.space)){
                this.Start = true
                this.initialTime = this.time.now
                this.Music.stop()
                this.Se.play()
                this.cameras.main.fade(1500)
            }
        }
        else{
            if(this.time.now - this.initialTime >= 1500){
                this.StartGame()
            }
        }
        
    }

    StartGame(){
        this.Se.stop()
        this.scene.start('Select',{NoteOpt:"normal", GuageOpt:"normal", AutoPlay:false,speed:9,draw:0,timing:0})
    }
}