import EventBus from './EventBus.js'
import * as welcome from '../scenes/welcome.js'
import * as characterSelect from '../scenes/characterSelect.js'
import * as bet from '../scenes/bet.js'
import * as gamePlay from '../scenes/gamePlay.js'
import * as winner from '../scenes/winner.js'

const scenes = { welcome, characterSelect, bet, gamePlay, winner }
let currentScene = null

const SceneManager = {
    goToScene(sceneName) {

        console.log("goToScene: " + sceneName);

        if (currentScene) {
            currentScene.onExit() // if currentScene is != null, exit current one
            currentScene.el.classList.remove('is-active')   // hide the html elements
        }
        currentScene = scenes[sceneName]    // select the new scene
        currentScene.el.classList.add('is-active')   // display the html elements
        currentScene.onEnter()  // "load" the new scene with all its methods
    }
}

EventBus.on('scene:welcome', () => SceneManager.goToScene('welcome'))
EventBus.on('scene:characterSelect', () => SceneManager.goToScene('characterSelect'))
EventBus.on('scene:bet', () => SceneManager.goToScene('bet'))
EventBus.on('scene:gamePlay', () => SceneManager.goToScene('gamePlay'))
EventBus.on('scene:winner', () => SceneManager.goToScene('winner'))


export default SceneManager