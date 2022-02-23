import Phaser from "phaser"

export default class Select extends Phaser.Scene
{
    private cursor!:Phaser.Types.Input.Keyboard.CursorKeys
    private title!:Phaser.GameObjects.Text
    private genre!:Phaser.GameObjects.Text
    private artist!:Phaser.GameObjects.Text
    private jsonData!:Phaser.Loader.FileTypes.JSONFile
    private jsonData_P!:Phaser.Loader.FileTypes.JSONFile
    private songindex = 0
    private songnum!:number
    private songdiff = "n"

    private musicList_image!:Array<Phaser.GameObjects.Image>
    private musicList_text!:Array<Phaser.GameObjects.Text>

    private Music!:Phaser.Sound.BaseSound
    private Se!:Phaser.Sound.BaseSound
    private Preview!:Array<Phaser.Sound.BaseSound>

    private diff_tex!:Phaser.Textures.Texture
    private diff_frames!:string[]
    private diff!:Phaser.GameObjects.Sprite

    private optionWindow!:Phaser.GameObjects.Image
    private optionCursor!:Phaser.GameObjects.Image
    private option_D_Cursor!:Array<Phaser.GameObjects.Image>
    private optionText!:Array<Phaser.GameObjects.Sprite>
    private optionDetail!:Phaser.GameObjects.Sprite
    private NoteOpt = "normal"
    private GuageOpt = "normal"
    private AutoPlay = false
    private option_open = false
    private optionCursorPos = 0

    private syncWindow!:Phaser.GameObjects.Image
    private syncCursor!:Phaser.GameObjects.Image
    private syncText!:Array<Phaser.GameObjects.Sprite>
    private syncNumText!:Array<Phaser.GameObjects.Text>
    private syncDetail!:Phaser.GameObjects.Sprite
    private sync_open = false
    private speed!:number
    private timing!:number
    private draw!:number
    private syncCursorPos = 0

    private s_diff_tex!:Phaser.Textures.Texture
    private s_diff!:Array<Phaser.GameObjects.Sprite>

    private scroll_n!:number
    private scroll_U!:boolean
    private scroll_D!:boolean

    constructor(){
        super('Select')
    }

    init(data){
        this.NoteOpt = data.NoteOpt
        this.GuageOpt = data.GuageOpt
        this.AutoPlay = data.AutoPlay
        this.speed = data.speed
        this.timing = data.timing
        this.draw = data.draw
    }

    create(){
        this.scroll_n = 0
        this.scroll_U = false
        this.scroll_D = false
        this.cursor = this.input.keyboard.createCursorKeys()
        this.jsonData = this.cache.json.get('songlist')
        this.jsonData_P = this.cache.json.get('path')
        this.songnum = this.jsonData['num']

        this.add.video(640,360,'m_select_bg').setLoop(true).play()

        this.Music = this.sound.add('bgm_select',{loop:true,volume:0.7})
        this.Music.play()
        this.Se = this.sound.add('se_movelist')

        this.Preview=[
            this.sound.add('prev_0'), this.sound.add('prev_1'),this.sound.add('prev_2'),
            this.sound.add('prev_3'), this.sound.add('prev_4'),this.sound.add('prev_5'),
            this.sound.add('prev_6'), this.sound.add('prev_7'),this.sound.add('prev_8'),
            this.sound.add('prev_9'), this.sound.add('prev_10'),this.sound.add('prev_11'),
            this.sound.add('prev_12')
        ]

        this.musicList_image = [this.add.image(920,-31.4+71.4*0,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*1,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*2,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*3,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*4,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*5,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*6,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*7,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*8,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*9,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*10,'listb').setScale(1.3,1.7),
        this.add.image(920,-31.4+71.4*11,'listb').setScale(1.3,1.7)]
        this.musicList_text = [this.add.text(680,-38+72*0,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*1,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*2,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*3,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*4,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*5,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*6,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*7,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*8,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*9,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*10,'',{
                fontFamily: 'font2', fontSize:'38px',}),
            this.add.text(680,-38+72*11,'',{
                fontFamily: 'font2', fontSize:'38px',})]
        
        for(let i =0; i<12; ++i){
            this.musicList_text[i].setOrigin(0.0,0.5)
            var num = this.songindex + i - 5
            if(num<0){
                num+=this.songnum
            }
            else if(num>=this.songnum){
                num-=this.songnum
            }
            this.musicList_text[i].text = this.jsonData['song'][num]['name']
        }

        this.diff_tex = this.textures.get('diff')
        this.diff_frames = this.diff_tex.getFrameNames()
        this.diff = this.add.sprite(285,620,'diff',
        this.diff_frames[this.jsonData['song'][this.songindex]['diff'][this.songdiff]-1])
        .setScale(1.7)

        this.s_diff_tex = this.textures.get('s_diff')
        this.s_diff = [this.add.sprite(615,-35+72*0,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*1,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*2,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*3,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*4,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*5,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*6,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*7,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*8,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*9,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*10,'s_diff',this.diff_frames[0]).setScale(1.3),
        this.add.sprite(615,-35+72*5*11,'s_diff',this.diff_frames[0]).setScale(1.3)
        ]
        for(let i =0; i<12; ++i){
            var num = this.songindex + i - 5
            if(num<0){
                num+=this.songnum
            }
            else if(num>=this.songnum){
                num-=this.songnum
            }
            this.s_diff[i].setFrame(this.diff_frames[this.jsonData['song'][num]['diff'][this.songdiff]-1])
        }
        this.add.image(895,-31.4+71.4*5,'listr').setScale(1.3,1.5)

        this.add.image(640,360,'m_select')
        this.add.image(280,690,'howto').setScale(0.6)
        this.add.spine(1140,240,'pin_chef','animation',true)
        
        const screenCenterX = 0 + 550 / 2
        const screenCenterY = 0 + 720 / 2
        this.title = this.add.text(screenCenterX,screenCenterY,
            this.jsonData['song'][this.songindex]['name'],{
                fontFamily: 'font1', fontSize:'50px', color:'white'
            ,shadow:{blur:10, fill:true}}).setOrigin(0.5)

        this.genre = this.add.text(screenCenterX,screenCenterY-70,
            this.jsonData['song'][this.songindex]['genre'],{
                fontFamily: 'font2', fontSize:'30px', color:'white'
            ,shadow:{blur:10, fill:true}}).setOrigin(0.5)

        this.artist = this.add.text(screenCenterX,screenCenterY+70,
            this.jsonData['song'][this.songindex]['artist'],{
                fontFamily: 'font3', fontSize:'20px', color:'white'
            ,shadow:{blur:10, fill:true}}).setOrigin(0.5)

        //옵션창
        {
            this.optionWindow = this.add.image(640,360,'playoption_bg').setVisible(false)
            this.option_D_Cursor=[
                this.add.image(175+(695/3)*1,250+40*0,'sel_d_option').setScale(1.73,1.6).setVisible(false),
                this.add.image(175+(695/3)*2,250+40*0,'sel_d_option').setScale(1.73,1.6).setVisible(false),
                this.add.image(175+(695/3)*3,250+40*2,'sel_d_option').setScale(1.73,1.6).setVisible(false)
            ]
            this.optionCursor = this.add.image(175+(695/3)*1,250+40*0,'sel_option').setScale(1.2,1.6).setVisible(false)
            
            this.optionDetail=this.add.sprite(175+480,500,'playoption_detail','NOTE_NORMAL.png').setVisible(false)
            this.optionText=[
            this.add.sprite(175+(695/3)*1,60+120,'playoption','NOTE.png'),
            this.add.sprite(175+(695/3)*1,250+40*0,'playoption','NORMAL.png'),
            this.add.sprite(175+(695/3)*1,250+40*1,'playoption','MIRROR.png'),
            this.add.sprite(175+(695/3)*1,250+40*2,'playoption','RANDOM.png'),
            this.add.sprite(175+(695/3)*1,250+40*3,'playoption','R-RANDOM.png'),

            this.add.sprite(175+(695/3)*2,60+120,'playoption','GUAGE.png'),
            this.add.sprite(175+(695/3)*2,250+40*0,'playoption','NORMAL.png'),
            this.add.sprite(175+(695/3)*2,250+40*1,'playoption','EASY.png'),
            this.add.sprite(175+(695/3)*2,250+40*2,'playoption','HARD.png'),
            this.add.sprite(175+(695/3)*2,250+40*3,'playoption','EX-HARD.png'),

            this.add.sprite(175+(695/3)*3,60+120,'playoption','AUTOPLAY.png'),
            this.add.sprite(175+(695/3)*3,250+40*1,'playoption','ON.png'),
            this.add.sprite(175+(695/3)*3,250+40*2,'playoption','OFF.png'),
            ]

            for(let i=0;i<13;++i){
                this.optionText[i].setVisible(false)
            }
            
        }
        // 싱크
        {
            this.syncWindow = this.add.image(640,360,'syncoption_bg').setVisible(false)
            this.syncCursor = this.add.image(175+(695/3)*1,300,'sel_sync').setVisible(false)
            this.syncDetail=this.add.sprite(175+480,500,'syncoption_detail','SPEED.png').setVisible(false)

            this.syncText=[
                this.add.sprite(175+(695/3)*1,60+120,'syncoption','SPEED.png'),
    
                this.add.sprite(175+(695/3)*2,60+120,'syncoption','DRAW.png'),

                this.add.sprite(175+(695/3)*3,60+120,'syncoption','TIMING.png'),
            ]
            for(let i=0;i<3;++i){
                this.syncText[i].setVisible(false)
            }
            this.syncNumText=[
                this.add.text(175+(695/3)*1,300,
                    `${this.speed}`,{
                        fontFamily: 'font2', fontSize:'30px', color:'white'
                    ,shadow:{blur:10, fill:true}}).setOrigin(0.5).setVisible(false),
                this.add.text(175+(695/3)*2,300,
                    `${this.draw}`,{
                        fontFamily: 'font2', fontSize:'30px', color:'white'
                    ,shadow:{blur:10, fill:true}}).setOrigin(0.5).setVisible(false),
                this.add.text(175+(695/3)*3,300,
                    `${this.timing}`,{
                        fontFamily: 'font2', fontSize:'30px', color:'white'
                    ,shadow:{blur:10, fill:true}}).setOrigin(0.5).setVisible(false)
            ]
            if(this.draw>0){
                this.syncNumText[1].text=`+${this.draw}`
            }
            else{
                this.syncNumText[1].text=`${this.draw}`
            }
            if(this.timing>0){
                this.syncNumText[2].text=`+${this.timing}`
            }
            else{
                this.syncNumText[2].text=`${this.timing}`
            }
        }
    }

    update(t, dt){
            if(this.Music.isPaused&&!this.Preview[this.songindex].isPlaying){
                this.Music.resume()
                console.log('resume');
                
            }
        
        if(this.scroll_U){
            for(let i = 0; i<12; ++i){
                const Image = this.musicList_image[i] as Phaser.GameObjects.Image
                const Text = this.musicList_text[i] as Phaser.GameObjects.Text
                const Diff = this.s_diff[i] as Phaser.GameObjects.Sprite
                Image.setY(Image.y-285.6*(dt/1000))  
                Text.setY(Text.y-285.6*(dt/1000))    
                Diff.setY(Diff.y-285.6*(dt/1000))
            }
            this.scroll_n+=dt
            if(this.scroll_n>=250){
                this.scroll_n = 0
                this.scroll_U = false

                this.songindex++
                if(this.songindex >= this.songnum){
                    this.songindex = 0 
                }
                this.renewText(this.songindex)

                this.Music.pause()
                for(let i= 0;i<this.songnum;++i){
                    this.Preview[i].stop()
                }
                this.Preview[this.songindex].play()

                for(let i = 0; i<12; ++i){
                    const Image = this.musicList_image[i] as Phaser.GameObjects.Image
                    const Text = this.musicList_text[i] as Phaser.GameObjects.Text
                    const Diff = this.s_diff[i] as Phaser.GameObjects.Sprite
                    Image.setY(-31.4+71.4*i)
                    Text.setY(-31.4+71.4*i)
                    Diff.setY(-31.4+71.4*i)
                    {
                        var num = this.songindex + i - 5
                        if(num<0){
                            num+=this.songnum
                        }
                        else if(num>=this.songnum){
                            num-=this.songnum
                        }
                        this.musicList_text[i].text = this.jsonData['song'][num]['name']
                        this.s_diff[i].setFrame(this.diff_frames[this.jsonData['song'][num]['diff'][this.songdiff]-1])
                    }
                }
            }
        }
        else if(this.scroll_D){
            for(let i = 0; i<12; ++i){
                const Image = this.musicList_image[i] as Phaser.GameObjects.Image
                const Text = this.musicList_text[i] as Phaser.GameObjects.Text
                const Diff = this.s_diff[i] as Phaser.GameObjects.Sprite
                Image.setY(Image.y+285.6*(dt/1000))
                Text.setY(Text.y+285.6*(dt/1000))   
                Diff.setY(Diff.y+285.6*(dt/1000))
            }
            this.scroll_n+=dt
            if(this.scroll_n>=250){
                this.scroll_n = 0
                this.scroll_D = false

                this.songindex--
                if(this.songindex <= -1){
                    this.songindex = this.songnum - 1
                }
                this.renewText(this.songindex)

                this.Music.pause()
                for(let i= 0;i<this.songnum;++i){
                    this.Preview[i].stop()
                }
                this.Preview[this.songindex].play()

                for(let i = 0; i<12; ++i){
                    const Image = this.musicList_image[i] as Phaser.GameObjects.Image
                    const Text = this.musicList_text[i] as Phaser.GameObjects.Text
                    const Diff = this.s_diff[i] as Phaser.GameObjects.Sprite
                    Image.setY(-31.4+71.4*i)
                    Text.setY(-31.4+71.4*i)
                    Diff.setY(-31.4+71.4*i)
                    {
                        var num = this.songindex + i - 5
                        if(num<0){
                            num+=this.songnum
                        }
                        else if(num>=this.songnum){
                            num-=this.songnum
                        }
                        this.musicList_text[i].text = this.jsonData['song'][num]['name']
                        this.s_diff[i].setFrame(this.diff_frames[this.jsonData['song'][num]['diff'][this.songdiff]-1])
                    }
                }
            }
        }
        
        if(this.option_open){
            if(Phaser.Input.Keyboard.JustDown(this.cursor.up)){
                this.moveOptCur('up')
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.down)){
                this.moveOptCur('down')
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.left)){
                this.moveOptCur('left')
                this.Se.play()
                
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.right)){
                this.moveOptCur('right')
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.shift)){
                this.toggleOptWin(false)
                this.toggleSyncWin(true)
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.space)){
                this.decideOpt()
                this.Se.play()
            }
        }
        else if(this.sync_open){
            if(Phaser.Input.Keyboard.JustDown(this.cursor.up)){
                this.moveSyncCur('up')
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.down)){
                this.moveSyncCur('down')
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.left)){
                this.moveSyncCur('left')
                this.Se.play()
                
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.right)){
                this.moveSyncCur('right')
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.shift)){
                this.toggleSyncWin(false)
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.space)){
                
                this.Se.play()
            }
        }
        else{
            if(Phaser.Input.Keyboard.JustDown(this.cursor.up) && !this.scroll_U){
                this.scroll_U = true   
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.down) && ! this.scroll_D){
                this.scroll_D = true
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.left)){
                if(this.songdiff!="n"){
                    if(this.songdiff=="h"){
                        this.songdiff="n"
                    }
                    else if(this.songdiff=="a"){
                        this.songdiff="h"
                    }     
                    this.renewS_diff(this.songindex)   
                    this.renewText(this.songindex)            
                    this.Se.play()
                }
                
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.right)){
                if(this.songdiff!="a"){
                    if(this.songdiff=="n"){
                        this.songdiff="h"
                    }
                    else if(this.songdiff=="h"){
                        this.songdiff="a"
                    }
                    this.renewS_diff(this.songindex)         
                    this.renewText(this.songindex)
                    this.Se.play()
                }   
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.shift)){
                this.toggleOptWin(true)
                this.moveOptCur('')
                this.moveBlueCur()
                this.Se.play()
            }
            else if(Phaser.Input.Keyboard.JustDown(this.cursor.space)&& !this.scroll_U&& !this.scroll_D){
                this.Music.stop()
                this.Preview[this.songindex].stop()
                this.scene.start('PrepareGame',
                {key:this.jsonData['song'][this.songindex]['key'], 
                title: this.title.text, genre:this.genre.text, 
                artist:this.artist.text, 
                level:this.jsonData['song'][this.songindex]['diff'][this.songdiff]-1,
                NoteOpt:this.NoteOpt, GuageOpt:this.GuageOpt, AutoPlay:this.AutoPlay,
                speed:this.speed,draw:this.draw,timing:this.timing})
            }
        }

        
    }

    renewText(index:number){
        this.title.text = this.jsonData['song'][index]['name']
        this.genre.text = this.jsonData['song'][index]['genre']
        this.artist.text = this.jsonData['song'][index]['artist']
        this.diff.setFrame(this.diff_frames[this.jsonData['song'][index]['diff'][this.songdiff]-1])
    }

    renewS_diff(index:number){
        for(let i = 0; i<12; ++i){
            var num = index + i - 5
            if(num<0){
                num+=this.songnum
            }
            else if(num>=this.songnum){
                num-=this.songnum
            }
            this.s_diff[i].setFrame(this.diff_frames[this.jsonData['song'][num]['diff'][this.songdiff]-1])
        }  
    }

    toggleOptWin(value:boolean){
        this.optionWindow.setVisible(value)
        this.optionCursor.setVisible(value)
        this.optionDetail.setVisible(value)
        for(let i=0;i<3;++i){
            this.option_D_Cursor[i].setVisible(value)
        }
        for(let i=0;i<13;++i){
            this.optionText[i].setVisible(value)
        }
        this.option_open=value
    }

    toggleSyncWin(value:boolean){
        this.syncWindow.setVisible(value)
        this.syncCursor.setVisible(value)
        this.syncDetail.setVisible(value)
        for(let i=0;i<3;++i){
            this.syncText[i].setVisible(value)
        }
        for(let i=0;i<3;++i){
            this.syncNumText[i].setVisible(value)
        }
        this.sync_open=value
    }

    moveOptCur(dirrection:string){
        if(dirrection == 'up'){
            if(this.optionCursorPos==0){
                this.optionCursorPos=3
            }
            else if(this.optionCursorPos==4){
                this.optionCursorPos=7
            }
            else if(this.optionCursorPos==8){
                this.optionCursorPos=9
            }
            else{
                this.optionCursorPos--
            }
        }
        else if(dirrection == 'down'){
            if(this.optionCursorPos==3){
                this.optionCursorPos=0
            }
            else if(this.optionCursorPos==7){
                this.optionCursorPos=4
            }
            else if(this.optionCursorPos==9){
                this.optionCursorPos=8
            }
            else{
                this.optionCursorPos++
            }
        }
        else if(dirrection == 'left'){
            if(this.optionCursorPos>=0 && this.optionCursorPos<=3){
                this.optionCursorPos=8
            }
            else if(this.optionCursorPos>=4 && this.optionCursorPos<=7){
                this.optionCursorPos=0
            }
            else{
                this.optionCursorPos=4
            }
        }
        else if(dirrection == 'right'){
            if(this.optionCursorPos>=0 && this.optionCursorPos<=3){
                this.optionCursorPos=4
            }
            else if(this.optionCursorPos>=4 && this.optionCursorPos<=7){
                this.optionCursorPos=8
            }
            else{
                this.optionCursorPos=0
            }
        }

        switch(this.optionCursorPos){
            case 0:
                this.optionCursor.setPosition(175+(695/3)*1,250+40*0)
                this.optionDetail.setFrame('NOTE_NORMAL.png')
                break;
            case 1:
                this.optionCursor.setPosition(175+(695/3)*1,250+40*1)
                this.optionDetail.setFrame('NOTE_MIRROR.png')
                break;
            case 2:
                this.optionCursor.setPosition(175+(695/3)*1,250+40*2)
                this.optionDetail.setFrame('NOTE_RANDOM.png')
                break;
            case 3:
                this.optionCursor.setPosition(175+(695/3)*1,250+40*3)
                this.optionDetail.setFrame('NOTE_R-RANDOM.png')
                break;
            case 4:
                this.optionCursor.setPosition(175+(695/3)*2,250+40*0)
                this.optionDetail.setFrame('GUAGE_NORMAL.png')
                break;
            case 5:
                this.optionCursor.setPosition(175+(695/3)*2,250+40*1)
                this.optionDetail.setFrame('GUAGE_EASY.png')
                break;
            case 6:
                this.optionCursor.setPosition(175+(695/3)*2,250+40*2)
                this.optionDetail.setFrame('GUAGE_HARD.png')
                break;
            case 7:
                this.optionCursor.setPosition(175+(695/3)*2,250+40*3)
                this.optionDetail.setFrame('GUAGE_EX-HARD.png')
                break;
            case 8:
                this.optionCursor.setPosition(175+(695/3)*3,250+40*1)
                this.optionDetail.setFrame('AUTOPLAY_ON.png')
                break;
            case 9:
                this.optionCursor.setPosition(175+(695/3)*3,250+40*2)
                this.optionDetail.setFrame('AUTOPLAY_OFF.png')
                break;
        }
    }

    moveSyncCur(dirrection:string){
        if(dirrection == 'up'){
            switch(this.syncCursorPos){
                case 0:
                    if(this.speed<15){
                        this.speed++
                        this.syncNumText[0].text=`${this.speed}`
                    }
                    break;
                case 1:
                    if(this.draw<10){
                        this.draw++
                        if(this.draw>0){
                            this.syncNumText[1].text=`+${this.draw}`
                        }
                        else{
                            this.syncNumText[1].text=`${this.draw}`
                        }
                    }
                    break;
                case 2:
                    if(this.timing<10){
                        this.timing++
                        if(this.timing>0){
                            this.syncNumText[2].text=`+${this.timing}`
                        }
                        else{
                            this.syncNumText[2].text=`${this.timing}`
                        }
                    }
                    break;
            }
        }
        else if(dirrection == 'down'){
            switch(this.syncCursorPos){
                case 0:
                    if(this.speed>1){
                        this.speed--
                        this.syncNumText[0].text=`${this.speed}`
                    }
                    break;
                case 1:
                    if(this.draw>-10){
                        this.draw--
                        if(this.draw>0){
                            this.syncNumText[1].text=`+${this.draw}`
                        }
                        else{
                            this.syncNumText[1].text=`${this.draw}`
                        }
                    }
                    break;
                case 2:
                    if(this.timing>-10){
                        this.timing--
                        if(this.timing>0){
                            this.syncNumText[2].text=`+${this.timing}`
                        }
                        else{
                            this.syncNumText[2].text=`${this.timing}`
                        }
                    }
                    break;
            }
        }
        else if(dirrection == 'left'){
            if(this.syncCursorPos!=0){
                this.syncCursorPos--
            }
                
        }
        else if(dirrection == 'right'){
            if(this.syncCursorPos!=2){
                this.syncCursorPos++
            }
        }

        switch(this.syncCursorPos){
            case 0:
                this.syncCursor.setPosition(175+(695/3)*1,300)
                this.syncDetail.setFrame('SPEED.png')
                break;
            case 1:
                this.syncCursor.setPosition(175+(695/3)*2,300)
                this.syncDetail.setFrame('DRAW.png')
                break;
            case 2:
                this.syncCursor.setPosition(175+(695/3)*3,300)
                this.syncDetail.setFrame('TIMING.png')
                break;
        }
    }

    moveBlueCur(){
        if(this.NoteOpt=='normal')
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*0)
            else if(this.NoteOpt=='mirror')
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*1)
            else if(this.NoteOpt=='random')
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*2)
            else if(this.NoteOpt=='r-random')
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*3)
                
            if(this.GuageOpt=='normal')
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*0)    
            else if(this.GuageOpt=='easy')
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*1)
            else if(this.GuageOpt=='hard')
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*2)
            else if(this.GuageOpt=='ex-hard')
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*3)

            if(this.AutoPlay)
                this.option_D_Cursor[2].setPosition(175+(695/3)*3,250+40*1)
            else
                this.option_D_Cursor[2].setPosition(175+(695/3)*3,250+40*2)
    }

    decideOpt(){
        switch(this.optionCursorPos){
            case 0:
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*0)
                this.NoteOpt='normal'
                break;
            case 1:
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*1)
                this.NoteOpt='mirror'
                break;
            case 2:
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*2)
                this.NoteOpt='random'
                break;
            case 3:
                this.option_D_Cursor[0].setPosition(175+(695/3)*1,250+40*3)
                this.NoteOpt='r-random'
                break;
            case 4:
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*0)
                this.GuageOpt='normal'
                break;
            case 5:
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*1)
                this.GuageOpt='easy'
                break;
            case 6:
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*2)
                this.GuageOpt='hard'
                break;
            case 7:
                this.option_D_Cursor[1].setPosition(175+(695/3)*2,250+40*3)
                this.GuageOpt='ex-hard'
                break;
            case 8:
                this.option_D_Cursor[2].setPosition(175+(695/3)*3,250+40*1)
                this.AutoPlay=true
                break;
            case 9:
                this.option_D_Cursor[2].setPosition(175+(695/3)*3,250+40*2)
                this.AutoPlay=false
                break;
        }
    }
}