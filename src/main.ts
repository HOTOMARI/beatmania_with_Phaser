import Phaser from 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin'
import SoundFadePlugin from 'phaser3-rex-plugins/plugins/soundfade-plugin.js'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import Select from './scenes/Select'
import Clear from './scenes/Clear'
import Fail from './scenes/Fail'
import PrepareGame from './scenes/PrepareGame'
import Title from './scenes/Title'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	backgroundColor:"#000000",
	scene: [Preloader,Title, Select, PrepareGame, Game, Clear,Fail],
    audio: {
        disableWebAudio: true
    },
	plugins:{
		scene:[
			{key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine'}
		]
	}
}

export default new Phaser.Game(config)
