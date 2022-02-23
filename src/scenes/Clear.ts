import Phaser from "phaser"

export default class Clear extends Phaser.Scene
{
    private cursor!:Phaser.Types.Input.Keyboard.CursorKeys
    private background!:Phaser.GameObjects.TileSprite
    private title!:string
    private artist!:string
    private key!:string

    private PGreat!:number
    private Great!:number
    private Miss!:number
    private TotalNotes!:number
    private slow!:number
    private fast!:number

    private Music!:Phaser.Sound.BaseSound
    private Se!:Phaser.Sound.BaseSound

    private initialTime!:number
    private TimeChk!: boolean
    private Start!: boolean

    private NoteOpt = "normal"
    private GuageOpt = "normal"
    private AutoPlay=false

    private speed = 9
    private timing = 0
    private draw = 0
    

    constructor(){
        super('Clear')
    }

    init(data){
        this.PGreat = data.PG
        this.Great = data.G
        this.Miss = data.MISS
        this.TotalNotes = data.Combo
        this.fast=data.fast
        this.slow=data.slow
        this.title = data.Title
        this.artist = data.Artist
        this.key = data.Key

        this.initialTime = 0
        this.TimeChk = false
        this.Start = false

        this.NoteOpt = data.NoteOpt
        this.GuageOpt = data.GuageOpt
        this.AutoPlay = data.AutoPlay

        this.speed = data.speed
        this.timing = data.timing
        this.draw = data.draw
        
    }

    create(){
        this.Music = this.sound.add('bgm_result')
        this.Music.play()
        this.Se = this.sound.add('se_changescene')

        this.background = this.add.tileSprite(0,0,1280,720,'bg_result_clear').setOrigin(0)
        this.add.image(640,360,'overlay_result_clear')
        this.add.sprite(295,457,'pg_result','score_panel_gre00.png').play('PG_result')
        //rank
        {
            let grade = (this.PGreat * 2 + this.Great) / (this.TotalNotes * 2)
            if( grade >= 6/9){
                if(grade >= 8/9){
                    this.add.sprite(306,290,'level','level_b_a.png')
                }
                if(grade >= 7/9){
                    this.add.sprite(394,290,'level','level_b_a.png')
                }
                this.add.sprite(482,290,'level','level_b_a.png')
            }
            else if(grade >= 5/9){
                this.add.sprite(482,290,'level','level_b_b.png')
            }
            else if(grade >= 4/9){
                this.add.sprite(482,290,'level','level_b_c.png')
            }
            else if(grade >= 3/9){
                this.add.sprite(482,290,'level','level_b_d.png')
            }
            else if(grade >= 2/9){
                this.add.sprite(482,290,'level','level_b_e.png')
            }
            else{
                this.add.sprite(482,290,'level','level_b_f.png')
            }
        }
             
        //songinfo
        {
            this.add.sprite(945,280,'jacket').setScale(0.5).setFrame(this.key)
            this.add.text(755+377/2,500,
                this.title,{fontFamily: 'font2', fontSize:'30px', align: 'center',
                }).setOrigin(0.5)
    
            this.add.text(755+377/2, 533,
                this.artist,{fontFamily: 'font3', fontSize:'20px', align: 'center',
            }).setOrigin(0.5)
        }

        this.cursor = this.input.keyboard.createCursorKeys()
        this.add.bitmapText(380,447,'result_font',`${this.PGreat}`,28)
        this.add.bitmapText(380,495,'result_font',`${this.Great}`,28)
        this.add.bitmapText(380,540,'result_font',`${this.Miss}`,28)
        this.add.bitmapText(310,613,'result_font',`${this.fast}`,28)
        this.add.bitmapText(470,613,'result_font',`${this.slow}`,28)
        console.log(this.fast);
        
        this.cameras.main.flash(1000,0,0,0)
    }

    update(t, dt){
        this.background.tilePositionX+=(30*(dt/1000))

        if(!this.TimeChk){
            this.initialTime = this.time.now
            this.TimeChk = true
        }

        if(!this.Start){
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
                this.Se.stop()
                this.scene.start('Select',{NoteOpt:this.NoteOpt, GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
                    speed:this.speed,draw:this.draw,timing:this.timing})
            }
        }
    }
}