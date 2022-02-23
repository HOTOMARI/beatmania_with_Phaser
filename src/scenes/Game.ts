import { MouseConstraint } from 'matter'
import Phaser, { GameObjects, Loader } from 'phaser'
import Note from '../objects/Note'
import Speed from '../objects/Speed'


export default class HelloWorldScene extends Phaser.Scene
{
    private Width = 1280
    private Height = 720
    private scrollSpeed = 900
    private PGoffset = Math.sqrt(this.scrollSpeed)
    private m_Speed = 1.0
    private initialTime = 0
    private measure = 1
    private CriticalLine = 550
    private KeyNum = 6

    private bpm!:Phaser.GameObjects.Text

    private Clap!:Array<Phaser.Sound.BaseSound>
    private Music!:Phaser.Sound.BaseSound
    private BGA!:Phaser.GameObjects.Video
    private title!:Phaser.GameObjects.Text
    private titleText!:string
    private genre!:Phaser.GameObjects.Text
    private genreText!:string
    private artist!:Phaser.GameObjects.Text
    private artistText!:string
    private lane_cover!:Phaser.GameObjects.Image

    private TimeChk!:boolean
    private GameRun!:boolean

    private Score!: Phaser.GameObjects.Text
    private SpeedTrigger!:Phaser.GameObjects.Group

    private GuageNum = 20
    private GuageText!:Phaser.GameObjects.Text
    private Guage!: Array<Phaser.GameObjects.Sprite>

    private Judge!: Phaser.GameObjects.Sprite
    private JudgeCombo!:Array<Phaser.GameObjects.Sprite>
    private JudgeComboKey!:Array<string>
    private JudgeFast!:Phaser.GameObjects.Text
    private JudgeSlow!:Phaser.GameObjects.Text
    private FastNum!:number
    private SlowNum!:number
    private JudgeTimer!:number
    private exp!: Array<Phaser.GameObjects.Sprite>
    private key_beam!: Array<Phaser.GameObjects.Image>

    private note!: Array<Phaser.GameObjects.Group>
    private line!:Array<number>
    private NoteOpt = "normal"
    private GuageOpt = "normal"
    private AutoPlay=false

    private jsonData!:Phaser.Loader.FileTypes.JSONFile

    private key!: Array<Phaser.Input.Keyboard.Key>
    private keyText!:Phaser.GameObjects.Text
    private keydown: Array<boolean> = [false, false, false, false, false, false]

    private song!: string

    private PGreat!:number
    private Great!:number
    private Miss!:number
    private Combo!:number

    private speed!:number
    private timing!:number
    private draw!:number

	constructor()
	{
		super('Game')
	}

    init(data){
        this.song = data.key
        this.titleText = data.title
        this.artistText = data.artist
        this.genreText = data.genre
        this.NoteOpt = data.NoteOpt
        this.GuageOpt = data.GuageOpt
        this.AutoPlay = data.AutoPlay

        this.speed = data.speed
        this.scrollSpeed = this.speed*100
        this.timing = data.timing
        this.draw = data.draw
        
        this.PGreat = 0
        this.Great = 0
        this.Miss = 0
        this.Combo = 0
        this.FastNum=0
        this.SlowNum=0
        if(data.GuageOpt=='hard'||data.GuageOpt=='ex-hard'){
            this.GuageNum = 100
        }
        else{
            this.GuageNum = 22
        }
        this.JudgeTimer = 1000
        this.JudgeComboKey=[
            'G0','G1','G2','G3','G4','G5','G6','G7','G8','G9',
            'PG0','PG1','PG2','PG3','PG4','PG5','PG6','PG7','PG8','PG9'
        ]
        this.line = [0,1,2,3,4,5]
        this.TimeChk = false
        this.GameRun = false
    }

    create()
    {
        this.cameras.main.flash(1000,0,0,0)
        //this.add.image(640,360,'BG')

        this.Music = this.sound.add(this.song)
        this.Clap = [this.sound.add('clap'),this.sound.add('clap'),this.sound.add('clap'),
        this.sound.add('clap'),this.sound.add('clap'),this.sound.add('clap')]

        this.BGA = this.add.video(865,333,this.song).setVolume(0).setVisible(false)
        this.BGA.setScale(575.0/this.BGA.height)

        this.title = this.add.text(1280-800+770/2,333,
            this.titleText,{fontFamily: 'font1', fontSize:'60px', align: 'center',
            }).setOrigin(0.5)

        this.genre = this.add.text(1280-800+770/2,233,
            this.genreText,{fontFamily: 'font2', fontSize:'40px', align: 'center',
            }).setOrigin(0.5)

        this.artist = this.add.text(1280-800+770/2, 533,
            this.artistText,{fontFamily: 'font3', fontSize:'25px', align: 'center',
        }).setOrigin(0.5)
 
        this.key_beam =[
            this.add.image(102,this.CriticalLine - 250,'beam_W').setScale(1.58,1), this.add.image(102+56.8*1,this.CriticalLine - 250,'beam_B').setScale(2,1),
            this.add.image(102+56.8*2,this.CriticalLine - 250,'beam_W').setScale(1.58,1), this.add.image(102+56.8*3,this.CriticalLine - 250,'beam_W').setScale(1.58,1),
            this.add.image(102+56.8*4,this.CriticalLine - 250,'beam_B').setScale(2,1), this.add.image(102+56.8*5,this.CriticalLine - 250,'beam_W').setScale(1.58,1)
        ]
        for(let i =0; i<6;++i){
            this.key_beam[i].setVisible(false)
        }
        this.add.image(243.5, this.CriticalLine, 'red').setScale(2.66,0.3)

        this.jsonData = this.cache.json.get(this.song)
        
        this.SpeedTrigger = this.add.group()
        for(let i = 0 ; i < this.jsonData['speedTrigger'] ; ++i){
            this.SpeedTrigger.add(new Speed(this,
                this.jsonData['speedData'][i]['speed'],
                this.jsonData['speedData'][i]['time']))            
        }

        this.note = [this.add.group(), this.add.group(), this.add.group(), this.add.group(), this.add.group(), this.add.group()]

        console.log('add notes');
        console.log(this.NoteOpt)
        if(this.NoteOpt=="random"){
            this.ShuffleLine(this.line)
        }
        else if (this.NoteOpt=="mirror"){
            this.line=[5,4,3,2,1,0]
        }
        else if (this.NoteOpt=="r-random"){
            const startline=this.getRandomInt(0,6)
            const dirrection = this.getRandomInt(0,2)   //left, right
            let index=startline

            this.line[index]=0
            if(dirrection){
                for(let i=1; i<6;++i){
                    index--
                    if(index<0){
                        index=5
                    }
                    this.line[index]=i
                }
            }
            else{
                for(let i=1; i<6;++i){
                    index++
                    if(index>5){
                        index=0
                    }
                    this.line[index]=i
                }
            }
        }
        console.log(this.line)
        for(let i = 0 ; i < this.jsonData['noteNum'] ; ++i){
            this.note[this.line[this.jsonData['noteData'][i]['line']]].add(new Note(this,
                this.jsonData['noteData'][i]['time'] + this.jsonData['offset'] - (this.draw*25) + 5000,
                this.line[this.jsonData['noteData'][i]['line']],this.scrollSpeed))

            
        }
        
        this.key = [
                    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
                    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
                    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
                    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        ]
        this.lane_cover = this.add.image(243.5,262,'lane_cover')

        this.exp =[
            this.add.sprite(102,this.CriticalLine,'boom','exp00_08.png'), this.add.sprite(102+56.8*1,this.CriticalLine,'boom','exp00_08.png'), 
            this.add.sprite(102+56.8*2,this.CriticalLine,'boom','exp00_08.png'), this.add.sprite(102+56.8*3,this.CriticalLine,'boom','exp00_08.png'), 
            this.add.sprite(102+56.8*4,this.CriticalLine,'boom','exp00_08.png'), this.add.sprite(102+56.8*5,this.CriticalLine,'boom','exp00_08.png')
        ]
    
        this.add.image(this.Width/2,this.Height/2,'frame')
        this.keyText = this.add.text(240,500,'S  D  F  J  K  L',{align:'center', fontFamily:'font3',fontSize:'40px'}).setOrigin(0.5)
        
        this.GuageText = this.add.text(440,650,'',{align:'center', fontFamily:'font3',fontSize:'40px'}).setOrigin(0.5)
        this.Guage =[
            this.add.sprite(80 +6.4,650,'guage','dark.png'),this.add.sprite(80 +6.4*1,650,'guage','dark.png'),this.add.sprite(80 +6.4*2,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*3,650,'guage','dark.png'),this.add.sprite(80 +6.4*4,650,'guage','dark.png'),this.add.sprite(80 +6.4*5,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*6,650,'guage','dark.png'),this.add.sprite(80 +6.4*7,650,'guage','dark.png'),this.add.sprite(80 +6.4*8,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*9,650,'guage','dark.png'),this.add.sprite(80 +6.4*10,650,'guage','dark.png'),this.add.sprite(80 +6.4*11,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*12,650,'guage','dark.png'),this.add.sprite(80 +6.4*13,650,'guage','dark.png'),this.add.sprite(80 +6.4*14,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*15,650,'guage','dark.png'),this.add.sprite(80 +6.4*16,650,'guage','dark.png'),this.add.sprite(80 +6.4*17,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*18,650,'guage','dark.png'),this.add.sprite(80 +6.4*19,650,'guage','dark.png'),this.add.sprite(80 +6.4*20,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*21,650,'guage','dark.png'),this.add.sprite(80 +6.4*22,650,'guage','dark.png'),this.add.sprite(80 +6.4*23,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*24,650,'guage','dark.png'),this.add.sprite(80 +6.4*25,650,'guage','dark.png'),this.add.sprite(80 +6.4*26,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*27,650,'guage','dark.png'),this.add.sprite(80 +6.4*28,650,'guage','dark.png'),this.add.sprite(80 +6.4*29,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*30,650,'guage','dark.png'),this.add.sprite(80 +6.4*31,650,'guage','dark.png'),this.add.sprite(80 +6.4*32,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*33,650,'guage','dark.png'),this.add.sprite(80 +6.4*34,650,'guage','dark.png'),this.add.sprite(80 +6.4*35,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*36,650,'guage','dark.png'),this.add.sprite(80 +6.4*37,650,'guage','dark.png'),this.add.sprite(80 +6.4*38,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*39,650,'guage','dark.png'),this.add.sprite(80 +6.4*40,650,'guage','dark.png'),this.add.sprite(80 +6.4*41,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*42,650,'guage','dark.png'),this.add.sprite(80 +6.4*43,650,'guage','dark.png'),this.add.sprite(80 +6.4*44,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*45,650,'guage','dark.png'),this.add.sprite(80 +6.4*46,650,'guage','dark.png'),this.add.sprite(80 +6.4*47,650,'guage','dark.png'),
            this.add.sprite(80 +6.4*48,650,'guage','dark.png'),this.add.sprite(80 +6.4*49,650,'guage','dark.png')
        ]
        for(let i = 0; i<50;++i){
            this.Guage[i].setScale(0.2)
        }

        this.Score = this.add.text(560,532,'TEST',{align:'center', fontFamily:'font3',}).setOrigin(0.5)

        this.Judge = this.add.sprite(264,400,'judge','judge_00.png').setVisible(false).setScale(0.8)
        this.JudgeCombo=[
            this.add.sprite(260,400,'judge_combo','judge_combo_0b.png').setVisible(false).setScale(0.8),
            this.add.sprite(288,400,'judge_combo','judge_combo_0b.png').setVisible(false).setScale(0.8),
            this.add.sprite(316,400,'judge_combo','judge_combo_0b.png').setVisible(false).setScale(0.8),
            this.add.sprite(344,400,'judge_combo','judge_combo_0b.png').setVisible(false).setScale(0.8)
        ]
        
        this.JudgeSlow = this.add.text(250,360,'SLOW',{fontFamily: 'font2', 
        fontSize:'16px',color:'skyblue',shadow:{color:'white',blur:20,fill:true}})
        .setOrigin(0.5).setVisible(false)
        this.JudgeFast = this.add.text(250,360,'FAST',{fontFamily: 'font2', 
        fontSize:'16px',color:'red',shadow:{color:'white',blur:20,fill:true}})
        .setOrigin(0.5).setVisible(false)

        if(this.jsonData['bpm']!=this.jsonData['maxbpm'] || this.jsonData['bpm']!=this.jsonData['minbpm']){
            this.add.text(940,645,`${this.jsonData['maxbpm']}`,{fontFamily: 'font2', fontSize:'16px',}).setOrigin(0.5)
            this.add.text(790,645,`${this.jsonData['minbpm']}`,{fontFamily: 'font2', fontSize:'16px',}).setOrigin(0.5)
        }
        this.bpm = this.add.text(865,643,`${this.jsonData['bpm']}`,{fontFamily: 'font2', fontSize:'20px',}).setOrigin(0.5)
        console.log('start soon');
        
    }

    update(t,dt){
        if(!this.TimeChk){
            this.initialTime = this.time.now
            this.TimeChk = true
        }

        if(this.time.now - this.initialTime >= 5000 && !this.GameRun){
            this.StartGame()
            this.TimeChk = false
            this.GameRun =true
        }
   
        if(this.JudgeTimer>=250){
            this.Judge.setVisible(false)
            for(let j = 0; j<4; ++j){
                this.JudgeCombo[j].setVisible(false)
            }
        }
        else if(this.Judge.visible){
            this.JudgeTimer += dt
        }

        this.Score.text=`PG:${this.PGreat}\n\nG:${this.Great}\n\nMISS:${this.Miss}`
        this.measure = (this.time.now - this.initialTime) / (1/(this.jsonData['bpm'] / 60) * 4*1000) + 1
        this.SpeedManager(this.time.now - this.initialTime)
        this.ScrollNotes(this.m_Speed, dt)
        this.renewGuage()

        if(this.AutoPlay){
            this.AutoPlay_func()
        }
        else{
            this.Key_Check()
            this.Miss_Check()   
        }

        if(this.time.now - this.initialTime >= this.jsonData['length']-1000){
            if(!this.cameras.main.fadeEffect.isRunning){
                this.cameras.main.fade(1200)
            }
        }
        if(this.time.now - this.initialTime >= this.jsonData['length']){
            this.FinishGame()
        }
    }

    SpeedManager(time:number){
        this.SpeedTrigger.children.each(child =>{
            const object = child as Speed
            if(time>=object.time){
                this.m_Speed = object.speed
                this.bpm.text = `${this.jsonData['bpm']*this.m_Speed}`
                object.destroy(true)
            }
        })
    }

    
    ScrollNotes(speedRaito:number, dt:number){
        for(let i = 0; i < this.KeyNum; i++){
            this.note[i].children.each(child =>{
                const note = child as Note
                note.tex.y += (this.scrollSpeed*speedRaito*(dt/1000))
            })
        }
    }

    AutoPlay_func(){
        for(let i = 0; i < this.KeyNum; ++i){
            let del = false
            this.note[i].children.each(child =>{
                if(!del){
                    const note = child as Note
                    // Great Check
                    if(note.y>=this.CriticalLine-8){
                        this.Combo++
                        this.JudgeTimer = 0

                        this.Judge.setVisible(true)
                        this.Judge.playAfterRepeat('PGreat')
                        this.JudgeComboAnimation(this.Combo, true)
                        this.JudgeFast.setVisible(false)
                        this.JudgeSlow.setVisible(false)
                        this.PGreat++
                        //this.Clap[i].play()
                            
                        if(this.GuageOpt=='normal'||this.GuageOpt=='easy'){
                            if(this.jsonData['noteNum']>=338){
                                this.GuageNum+= (((760.5*this.jsonData['noteNum'])/(650+this.jsonData['noteNum']))/this.jsonData['noteNum'])
                            }
                            else{
                                this.GuageNum+= (260/this.jsonData['noteNum'])
                            }
                        }
                        else{
                            this.GuageNum+= 0.16
                        }
                        this.exp[i].play('boom-active')
                        note.RemovefromScreen()
                        note.destroy(true)
                        del=true
                    }
                }
            })

            if(Phaser.Input.Keyboard.JustDown(this.key[i])){
                
                this.keydown[i] = true
                this.key_beam[i].setVisible(true)
            }
            else if(Phaser.Input.Keyboard.JustUp(this.key[i])){
                this.keydown[i]=false
                this.key_beam[i].setVisible(false)
            }
        }
    }

    Key_Check(){
        for(let i = 0; i < this.KeyNum; ++i){
            if(this.GuageNum>0){
                if(Phaser.Input.Keyboard.JustDown(this.key[i])){
                
                    this.keydown[i] = true
                    this.key_beam[i].setVisible(true)
        
                    let del = false
                    this.note[i].children.each(child =>{
                        if(!del){
                            const note = child as Note
                            console.log(`${this.time.now - this.initialTime}`);
                            // Great Check
                            if(note.y>=(this.CriticalLine-(this.timing*5))-(this.PGoffset * 4 * this.m_Speed)){
                                this.Combo++
                                this.JudgeTimer = 0
                                if(note.y<=(this.CriticalLine-(this.timing*10)) - (this.PGoffset * this.m_Speed)){
                                    console.log(`${note.y-(this.CriticalLine - (this.PGoffset * this.m_Speed))}`);
                                    this.Judge.setVisible(true)
                                    this.Judge.play('Great',true)
                                    this.JudgeComboAnimation(this.Combo, false)
                                    this.JudgeFast.setVisible(true)
                                    this.JudgeSlow.setVisible(false)
                                    this.FastNum++
                                    this.Great++
                                }
                                else if(note.y>=(this.CriticalLine-(this.timing*10)) + (this.PGoffset * this.m_Speed)){
                                    console.log(`${note.y - (this.CriticalLine - (this.PGoffset * this.m_Speed))}`);
                                    this.Judge.setVisible(true)
                                    this.Judge.play('Great',true)
                                    this.JudgeComboAnimation(this.Combo, false)
                                    this.JudgeFast.setVisible(false)
                                    this.JudgeSlow.setVisible(true)
                                    this.SlowNum++
                                    this.Great++
                                }
                                else{
                                    this.Judge.setVisible(true)
                                    this.Judge.playAfterRepeat('PGreat')
                                    this.JudgeComboAnimation(this.Combo, true)
                                    this.JudgeFast.setVisible(false)
                                    this.JudgeSlow.setVisible(false)
                                    this.PGreat++
                                }
                                if(this.GuageOpt=='normal'||this.GuageOpt=='easy'){
                                    if(this.jsonData['noteNum']>=338){
                                        this.GuageNum+= (((760.5*this.jsonData['noteNum'])/(650+this.jsonData['noteNum']))/this.jsonData['noteNum'])
                                    }
                                    else{
                                        this.GuageNum+= (260/this.jsonData['noteNum'])
                                    }
                                }
                                else{
                                    this.GuageNum+= 0.16
                                }
                                this.exp[i].play('boom-active')
                                note.RemovefromScreen()
                                note.destroy(true)
                                del=true
                            }
                            // 너무 일찍 누르면 miss
                            else{
                                if(note.y>=(this.CriticalLine-(this.timing*10)) - (this.PGoffset * 6 * this.m_Speed)){
                                    this.JudgeTimer = 0
                                    this.Combo = 0
                                    for(let j = 0; j<4; ++j){
                                        this.JudgeCombo[j].setVisible(false)
                                    }
                                    this.Judge.setPosition(270,400)
                                    this.Judge.play('Poor',true)
                                    this.JudgeFast.setVisible(false)
                                    this.JudgeSlow.setVisible(false)
                                    this.Miss++
                                    if(this.GuageOpt=='normal'){
                                        this.GuageNum-=2
                                    }
                                    else if(this.GuageOpt=='easy'){
                                        this.GuageNum-=1.6
                                    }
                                    else if(this.GuageOpt=='hard'){
                                        if(Math.floor(this.GuageNum)<=30){
                                            this.GuageNum-=2.5    
                                        }
                                        else{
                                            this.GuageNum-=5
                                        }      
                                    }
                                    else if(this.GuageOpt=='ex-hard'){
                                        this.GuageNum-=10
                                    }
                                    note.RemovefromScreen()
                                    note.destroy(true)
                                }
                                del=true 
                            }
                        }
                    })
                }
                else if(Phaser.Input.Keyboard.JustUp(this.key[i])){
                    this.keydown[i]=false
                    this.key_beam[i].setVisible(false)
                }
            }
        }
    }

    Miss_Check(){
        for(let i = 0; i < this.KeyNum ; ++i){
            if(this.GuageNum>0){
                let del = false
                this.note[i].children.each(child =>{
                    if(!del){
                        const note = child as Note
                        if(note.y>=620-(this.timing*10)){
                            this.Judge.setVisible(true)
                            this.JudgeTimer = 0
                            this.Judge.setPosition(270,400)
                            this.Combo = 0
                                    for(let j = 0; j<4; ++j){
                                        this.JudgeCombo[j].setVisible(false)
                                    }
                            this.Judge.play('Poor')
                            this.JudgeFast.setVisible(false)
                            this.JudgeSlow.setVisible(false)
                            this.Miss++
                            if(this.GuageOpt=='normal'){
                                this.GuageNum-=6
                            }
                            else if(this.GuageOpt=='easy'){
                                this.GuageNum-=4.8
                            }
                            else if(this.GuageOpt=='hard'){
                                if(Math.floor(this.GuageNum)<=30){
                                    this.GuageNum-=4.5    
                                }
                                else{
                                    this.GuageNum-=9
                                } 
                            }
                            else if(this.GuageOpt=='ex-hard'){
                                this.GuageNum-=18
                            }
                            note.RemovefromScreen()
                            note.destroy(true)
                            del=true
                        }
                    }
                })
            }
          
        }             
    }

    renewGuage(){
        if(this.GuageOpt=='normal'||this.GuageOpt=='easy'){
            if(this.GuageNum<2){
                this.GuageNum = 2
            }
            else if(this.GuageNum>100){
                this.GuageNum=100
            }
            this.GuageText.text=`${Math.floor(this.GuageNum)}%`
            for(let i = 0; i<40;++i){
                if(Math.floor(this.GuageNum)>=i*2){
                    this.Guage[i].setFrame('blue.png')
                }
                else{
                    this.Guage[i].setFrame('dark.png')
                }
            }
            
            for(let i = 40; i<50;++i){
                if(Math.floor(this.GuageNum)>=i*2){
                    this.Guage[i].setFrame('red.png')
                }
                else{
                    this.Guage[i].setFrame('dark.png')
                }
            }
        }
        else if(this.GuageOpt=='hard'){
            if(this.GuageNum<0){
                this.GuageNum=0
                this.FinishGame()
            }
            else if(this.GuageNum>100){
                this.GuageNum=100
            }
            this.GuageText.text=`${Math.floor(this.GuageNum)}%`
            for(let i = 0; i<50;++i){
                if(Math.floor(this.GuageNum)>=i*2){
                    this.Guage[i].setFrame('red.png')
                }
                else{
                    this.Guage[i].setFrame('dark.png')
                }
            }
        }
        else if(this.GuageOpt=='ex-hard'){
            if(this.GuageNum<0){
                this.GuageNum=0
                this.FinishGame()
            }
            else if(this.GuageNum>100){
                this.GuageNum=100
            }
            this.GuageText.text=`${Math.floor(this.GuageNum)}%`
            for(let i = 0; i<50;++i){
                if(Math.floor(this.GuageNum)>=i*2){
                    this.Guage[i].setFrame('yellow.png')
                }
                else{
                    this.Guage[i].setFrame('dark.png')
                }
            }
        }
        
    }

    StartGame(){
        this.keyText.setVisible(false)
        this.lane_cover.setVisible(false)
        this.Music.play()
        this.BGA.play().setVisible(true)
        this.title.setVisible(false)
        this.artist.setVisible(false)
        this.genre.setVisible(false)
        for(let i = 0 ; i < this.KeyNum ; ++i){
            this.note[i].runChildUpdate = true
        }
    }

    FinishGame(){
        this.Music.stop()
        this.Music.destroy()
        this.BGA.stop()
        this.BGA.destroy()
        this.cache.json.remove(this.song)
        if(this.GuageOpt=='normal'||this.GuageOpt=='easy'){
            if(this.GuageNum>=80){
                this.scene.start('Clear',{PG:this.PGreat, G:this.Great, MISS:this.Miss, 
                    Combo:this.jsonData['noteNum'],Title:this.titleText, Artist:this.artistText, Key:this.song,
                NoteOpt:this.NoteOpt, GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
                speed:this.speed,draw:this.draw,timing:this.timing, fast:this.FastNum, slow:this.SlowNum})
            }
            else{
                this.scene.start('Fail',{PG:this.PGreat, G:this.Great, MISS:this.Miss, 
                    Combo:this.jsonData['noteNum'],Title:this.titleText, Artist:this.artistText, Key:this.song,
                    NoteOpt:this.NoteOpt, GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
                    speed:this.speed,draw:this.draw,timing:this.timing, fast:this.FastNum, slow:this.SlowNum})
            }
        }
        else{
            if(this.GuageNum>0){
                this.scene.start('Clear',{PG:this.PGreat, G:this.Great, MISS:this.Miss, 
                    Combo:this.jsonData['noteNum'],Title:this.titleText, Artist:this.artistText, Key:this.song,
                    NoteOpt:this.NoteOpt, GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
                    speed:this.speed,draw:this.draw,timing:this.timing, fast:this.FastNum, slow:this.SlowNum})
            }
            else{
                this.scene.start('Fail',{PG:this.PGreat, G:this.Great, MISS:this.Miss, 
                    Combo:this.jsonData['noteNum'],Title:this.titleText, Artist:this.artistText, Key:this.song,
                    NoteOpt:this.NoteOpt, GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
                    speed:this.speed,draw:this.draw,timing:this.timing, fast:this.FastNum, slow:this.SlowNum})
            }
        }
        
    }

    JudgeComboAnimation(combo:number, PG:boolean){
        const m_combo = combo
        if(PG){
            if(combo!=0){
                this.JudgeCombo[3].setVisible(true)
                this.JudgeCombo[3].play(this.JudgeComboKey[m_combo%10 + 10])
                this.Judge.setPosition(264,400)
            }
            if(combo>9){
                this.JudgeCombo[2].setVisible(true)
                this.JudgeCombo[2].play(this.JudgeComboKey[Math.floor(m_combo%100/10)+10])
                this.Judge.setPosition(236,400)
            }
            if(combo>99){
                this.JudgeCombo[1].setVisible(true)
                this.JudgeCombo[1].play(this.JudgeComboKey[Math.floor(m_combo%1000/100) + 10])
                this.Judge.setPosition(208,400)
            }
            if(combo>999){
                this.JudgeCombo[0].setVisible(true)
                this.JudgeCombo[0].play(this.JudgeComboKey[Math.floor(m_combo%10000/1000) + 10])
                this.Judge.setPosition(180,400)
            }
        }
        else{
            if(combo!=0){
                this.JudgeCombo[3].setVisible(true)
                this.JudgeCombo[3].play(this.JudgeComboKey[m_combo%10])
                this.Judge.setPosition(264,400)
            }
            if(combo>9){
                this.JudgeCombo[2].setVisible(true)
                this.JudgeCombo[2].play(this.JudgeComboKey[Math.floor(m_combo%100/10)])
                this.Judge.setPosition(236,400)
            }
            if(combo>99){
                this.JudgeCombo[1].setVisible(true)
                this.JudgeCombo[1].play(this.JudgeComboKey[Math.floor(m_combo%1000/100)])
                this.Judge.setPosition(208,400)
            }
            if(combo>999){
                this.JudgeCombo[0].setVisible(true)
                this.JudgeCombo[0].play(this.JudgeComboKey[Math.floor(m_combo%10000/1000)])
                this.Judge.setPosition(180,400)
            }
        }
    }

    ShuffleLine(a:Array<number>) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    getRandomInt(min, max):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }
}
