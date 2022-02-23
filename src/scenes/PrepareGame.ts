import Phaser from "phaser";
import HelloWorldScene from "./Game";

export default class PrepareGame extends Phaser.Scene
{
    private jsonData!:Phaser.Loader.FileTypes.JSONFile
    private song!: string
    private titleText!:string
    private genreText!:string
    private artistText!:string
    private level!:number
    private NoteOpt!:string
    private GuageOpt!:string
    private AutoPlay!:boolean

    private initialTime = 0
    private TimeChk!:boolean
    private Fade!:boolean

    private title!:Phaser.GameObjects.Text
    private genre!:Phaser.GameObjects.Text
    private artist!:Phaser.GameObjects.Text

    private diff_tex!:Phaser.Textures.Texture
    private diff_frames!:string[]
    private diff!:Phaser.GameObjects.Sprite

    private speed = 9
    private timing = 0
    private draw = 0

    constructor() {
		super('PrepareGame')

	}

    init(data){
        this.song = data.key
        this.titleText = data.title
        this.artistText = data.artist
        this.genreText = data.genre
        this.jsonData = this.cache.json.get('path')
        this.level = data.level
        this.NoteOpt = data.NoteOpt
        this.GuageOpt = data.GuageOpt
        this.AutoPlay = data.AutoPlay

        this.TimeChk = false
        this.Fade = false

        this.speed = data.speed
        this.timing = data.timing
        this.draw = data.draw
    }
    
    preload(){
        console.log('load');

        if(this.level>=0 && this.level<12){
            this.load.json(this.song, this.jsonData[this.song]['chart']['n'])
        }
        else if(this.level>=12 && this.level<24){
            this.load.json(this.song, this.jsonData[this.song]['chart']['h'])
        }
        else{
            this.load.json(this.song, this.jsonData[this.song]['chart']['a'])
        }
        
        this.load.audio(this.song, this.jsonData[this.song]['music'])
        this.load.video(this.song, this.jsonData[this.song]['video'])
 
        
    }

    create(){
        this.sound.add('bgm_decide').play()
        this.add.image(640,360,'bg_decide')

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2
        this.title = this.add.text(screenCenterX,screenCenterY,
            this.titleText,{fontFamily: 'font1', fontSize:'60px', shadow:{blur:20, fill:true}
            }).setOrigin(0.5)

        this.genre = this.add.text(screenCenterX,screenCenterY-100,
            this.genreText,{fontFamily: 'font2', fontSize:'40px', shadow:{blur:20, fill:true}
            }).setOrigin(0.5)

        this.artist = this.add.text(screenCenterX,screenCenterY+230,
            this.artistText,{fontFamily: 'font3', fontSize:'30px', shadow:{blur:20, fill:true}
            }).setOrigin(0.5)
        
        this.diff_tex = this.textures.get('diff')
        this.diff_frames = this.diff_tex.getFrameNames()
        this.diff = this.add.sprite(screenCenterX,screenCenterY+140,'diff',
        this.diff_frames[this.level])
        .setScale(1.5)


        this.cameras.main.flash(500,0,0,0)
    }

    update(t,dt){
        if(!this.TimeChk){
            this.initialTime = this.time.now
            this.TimeChk = true
        }
        
        if(this.time.now - this.initialTime >= 2900 && !this.Fade){
            this.cameras.main.fade(1000)
            this.Fade = true
        }
        

        if(this.time.now - this.initialTime >= 4000){
            this.TimeChk = false
            this.scene.start('Game',
        {key:this.song, title: this.titleText, genre:this.genreText, artist:this.artistText, NoteOpt:this.NoteOpt,GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
            speed:this.speed,draw:this.draw,timing:this.timing})
        }
    }
}