import Phaser from "phaser";

export default class Preloader extends Phaser.Scene
{
    private cursor!:Phaser.Types.Input.Keyboard.CursorKeys
    constructor() {
		super('Preloader')
	}
    
    preload(){
        console.log('preload');
        this.cursor = this.input.keyboard.createCursorKeys()
        
        this.add.text(0,0,'Load Video')
        this.load.video('m_select_bg','assets/video/music_sel_bg.mp4')
        
        this.add.text(0,15,'Load Atlas')
        this.load.atlas('boom','assets/sprites/boom.png', 'assets/sprites/boom.json')
        this.load.atlas('judge','assets/sprites/judge.png', 'assets/sprites/judge.json')
        this.load.atlas('judge_combo','assets/sprites/judge_combo.png', 'assets/sprites/judge_combo.json')
        this.load.atlas('guage','assets/sprites/guage.png','assets/sprites/guage.json')
        this.load.atlas('pg_result','assets/sprites/pg_result.png', 'assets/sprites/pg_result.json')
        this.load.atlas('level','assets/sprites/level.png', 'assets/sprites/level.json')
        this.load.atlas('diff','assets/sprites/difficulty.png', 'assets/sprites/difficulty.json')
        this.load.atlas('s_diff','assets/sprites/difficulty_small.png', 'assets/sprites/difficulty_small.json')
        this.load.atlas('jacket','assets/sprites/jacket-0.png', 'assets/sprites/jacket.json')
        this.load.atlas('playoption','assets/sprites/playoption.png', 'assets/sprites/playoption.json')
        this.load.atlas('playoption_detail','assets/sprites/playoption_detail.png', 'assets/sprites/playoption_detail.json')
        this.load.atlas('syncoption','assets/sprites/syncoption.png', 'assets/sprites/syncoption.json')
        this.load.atlas('syncoption_detail','assets/sprites/syncoption_detail.png', 'assets/sprites/syncoption_detail.json')
        this.load.spine('pin_chef','assets/spine/pin_chef.json','assets/spine/pin_chef.atlas')

        this.add.text(0,30,'Load Image')
        this.load.image('sample','assets/textures/sample.png')
        this.load.image('red', 'assets/textures/red.png')
        this.load.image('blue', 'assets/textures/blue.png')
        this.load.image('white', 'assets/textures/white.png')
        this.load.image('listb', 'assets/textures/listb.png')
        this.load.image('listr', 'assets/textures/listr.png')
        this.load.image('frame','assets/textures/frame.png')
        this.load.image('lane','assets/textures/lane.png')
        this.load.image('lane_cover','assets/textures/lane_cover.png')
        this.load.image('beam_W','assets/textures/playm_bar_white.png')
        this.load.image('beam_B','assets/textures/playm_bar_blue.png')
        this.load.image('overlay_result_clear','assets/textures/overlay_result_clear.png')
        this.load.image('overlay_result_fail','assets/textures/overlay_result_fail.png')
        this.load.image('m_select','assets/textures/m_select.png')
        this.load.image('bg_result_clear','assets/textures/bg_result_clear.png')
        this.load.image('bg_result_fail','assets/textures/bg_result_fail.png')
        this.load.image('bg_decide','assets/textures/bg_decide.png')
        this.load.image('bg_main','assets/textures/bg_main.png')
        this.load.image('title','assets/textures/title.png')
        this.load.image('howto','assets/textures/howto.png')
        this.load.image('playoption_bg','assets/textures/playoption.png')
        this.load.image('syncoption_bg','assets/textures/syncoption.png')
        this.load.image('sel_sync','assets/textures/synccur.png')
        this.load.image('sel_option','assets/textures/sel_option.png')
        this.load.image('sel_d_option','assets/textures/sel_d_option.png')

        this.add.text(0,45,'Load Json')
        this.load.json('songlist','assets/json/songs.json')
        this.load.json('path','assets/json/Path.json')

        this.add.text(0,60,'Load Font')
        this.load.bitmapFont('result_font','assets/fonts/result_font.png','assets/fonts/result_font.xml')
        
        this.add.text(0,75,'Load Sound')
        this.load.audio('bgm_title','assets/sounds/bgm_title.mp3')
        this.load.audio('bgm_select','assets/sounds/bgm_select.mp3')
        this.load.audio('bgm_decide','assets/sounds/bgm_decide.mp3')
        this.load.audio('bgm_result','assets/sounds/bgm_result.mp3')
        this.load.audio('se_movelist','assets/sounds/se_movelist.mp3')
        this.load.audio('se_changescene','assets/sounds/se_changescene.mp3')
        this.load.audio('clap','assets/sounds/clap.mp3')

        this.load.audio('prev_0','assets/sounds/prev/00.mp3')
        this.load.audio('prev_1','assets/sounds/prev/01.mp3')
        this.load.audio('prev_2','assets/sounds/prev/02.mp3')
        this.load.audio('prev_3','assets/sounds/prev/03.mp3')
        this.load.audio('prev_4','assets/sounds/prev/04.mp3')
        this.load.audio('prev_5','assets/sounds/prev/05.mp3')
        this.load.audio('prev_6','assets/sounds/prev/06.mp3')
        this.load.audio('prev_7','assets/sounds/prev/07.mp3')
        this.load.audio('prev_8','assets/sounds/prev/08.mp3')
        this.load.audio('prev_9','assets/sounds/prev/09.mp3')
        this.load.audio('prev_10','assets/sounds/prev/10.mp3')
        this.load.audio('prev_11','assets/sounds/prev/11.mp3')
        this.load.audio('prev_12','assets/sounds/prev/12.mp3')
    }

    create(){
        this.add.text(0,90,'Animation Create')
        //boom
        this.anims.create({
            key:'boom-active',
            frames: this.anims.generateFrameNames('boom',{
                start: 0,
                end: 8,
                prefix:'exp00_',
                zeroPad: 2,
                suffix:'.png'
            }),
            frameRate: 60,
            repeat: 0
        })

        //judge
        {
            this.anims.create({
                key:'Great',
                frames: this.anims.generateFrameNames('judge',{
                    start: 0,
                    end: 0,
                    prefix:'judge_',
                    zeroPad: 2,
                    suffix:'.png'
                }),
                frameRate: 24,
                repeat: 0
            })
            this.anims.create({
                key:'PGreat',
                frames: this.anims.generateFrameNames('judge',{
                    start: 1,
                    end: 3,
                    prefix:'judge_',
                    zeroPad: 2,
                    suffix:'.png'
                }),
                frameRate: 24,
                repeat: 0
            })
            this.anims.create({
                key:'Poor',
                frames: this.anims.generateFrameNames('judge',{
                    start: 4,
                    end: 4,
                    prefix:'judge_',
                    zeroPad: 2,
                    suffix:'.png'
                }),
                frameRate: 24,
                repeat: 0
            })
        }
        
        //judge_combo
        {
            //Great
            {
                this.anims.create({
                    key:"G0",
                    frames: [{key:"judge_combo",frame:"judge_combo_0y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G1",
                    frames: [{key:"judge_combo",frame:"judge_combo_1y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G2",
                    frames: [{key:"judge_combo",frame:"judge_combo_2y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G3",
                    frames: [{key:"judge_combo",frame:"judge_combo_3y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G4",
                    frames: [{key:"judge_combo",frame:"judge_combo_4y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G5",
                    frames: [{key:"judge_combo",frame:"judge_combo_5y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G6",
                    frames: [{key:"judge_combo",frame:"judge_combo_6y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G7",
                    frames: [{key:"judge_combo",frame:"judge_combo_7y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G8",
                    frames: [{key:"judge_combo",frame:"judge_combo_8y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"G9",
                    frames: [{key:"judge_combo",frame:"judge_combo_9y.png"}],
                    frameRate: 24,
                    repeat: 0
                })
            }
            
            //PGreat
            {
                this.anims.create({
                    key:"PG0",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_0b.png"},
                        {key:"judge_combo",frame:"judge_combo_0r.png"},
                        {key:"judge_combo",frame:"judge_combo_0g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG1",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_1b.png"},
                        {key:"judge_combo",frame:"judge_combo_1r.png"},
                        {key:"judge_combo",frame:"judge_combo_1g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG2",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_2b.png"},
                        {key:"judge_combo",frame:"judge_combo_2r.png"},
                        {key:"judge_combo",frame:"judge_combo_2g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG3",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_3b.png"},
                        {key:"judge_combo",frame:"judge_combo_3r.png"},
                        {key:"judge_combo",frame:"judge_combo_3g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG4",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_4b.png"},
                        {key:"judge_combo",frame:"judge_combo_4r.png"},
                        {key:"judge_combo",frame:"judge_combo_4g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG5",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_5b.png"},
                        {key:"judge_combo",frame:"judge_combo_5r.png"},
                        {key:"judge_combo",frame:"judge_combo_5g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG6",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_6b.png"},
                        {key:"judge_combo",frame:"judge_combo_6r.png"},
                        {key:"judge_combo",frame:"judge_combo_6g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG7",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_7b.png"},
                        {key:"judge_combo",frame:"judge_combo_7r.png"},
                        {key:"judge_combo",frame:"judge_combo_7g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG8",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_8b.png"},
                        {key:"judge_combo",frame:"judge_combo_8r.png"},
                        {key:"judge_combo",frame:"judge_combo_8g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
                this.anims.create({
                    key:"PG9",
                    frames:[
                        {key:"judge_combo",frame:"judge_combo_9b.png"},
                        {key:"judge_combo",frame:"judge_combo_9r.png"},
                        {key:"judge_combo",frame:"judge_combo_9g.png"}
                    ],
                    frameRate: 24,
                    repeat: 0
                })
            }
        }

        this.anims.create({
            key:'PG_result',
            frames: this.anims.generateFrameNames('pg_result',{
                start: 0,
                end: 3,
                prefix:'score_panel_gre',
                zeroPad: 2,
                suffix:'.png'
            }),
            frameRate: 24,
            repeat: -1
        })

        this.add.text(0,200,'Load Complete\nPress Space to start game...')
        //this.scene.start('Title')
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.cursor.space)){
            this.scale.startFullscreen()
            this.scene.start('Title')
        }
    }
}