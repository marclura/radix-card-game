import EventBus from './EventBus.js'
import { SCENE_TITLES } from '../../../data/scenes.js'
import * as welcome from '../scenes/welcome.js'
import * as characterSelect from '../scenes/characterSelect.js'
import * as bet from '../scenes/bet.js'
import * as gamePlay from '../scenes/gamePlay.js'
import * as winner from '../scenes/winner.js'
import { SETTINGS } from '../../../data/settings.js'

// Transition timing parameters (ms)
const TRANSITION_FADE_TO_WHITE_DURATION    = 800  // step 1 - overlay fade to white
const TRANSITION_TEXT_DROP_DURATION        = 600  // step 2 - text drop-in animation
const TRANSITION_TEXT_READ_DURATION        = SETTINGS.gameOverlayTransitionTextDuration * 1000 // step 3 - time to read the text
const TRANSITION_TEXT_LEAVE_DURATION       = 600  // step 5 - text leave animation
const TRANSITION_OVERLAY_FADE_OUT_DURATION = 800  // step 6 - overlay fade out

const scenes = { welcome, characterSelect, bet, gamePlay, winner }
let currentScene = null
let isTransitioning = false

const phaseTitleOverlay = document.querySelector('#phase-title-overlay')
const phaseTitleText = document.querySelector('#phase-title-text')

// expose timing as CSS custom properties so the Stylus keyframes can use them
phaseTitleOverlay.style.setProperty('--fade-in-duration', `${TRANSITION_FADE_TO_WHITE_DURATION}ms`)
phaseTitleOverlay.style.setProperty('--fade-out-duration', `${TRANSITION_OVERLAY_FADE_OUT_DURATION}ms`)
phaseTitleText.style.setProperty('--text-drop-duration', `${TRANSITION_TEXT_DROP_DURATION}ms`)
phaseTitleText.style.setProperty('--text-leave-duration', `${TRANSITION_TEXT_LEAVE_DURATION}ms`)

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// restart a CSS animation by removing/re-adding the class with a forced reflow
function restartAnimation(el, className) {
    el.classList.remove(className)
    void el.offsetWidth // force reflow
    el.classList.add(className)
}

function fadeInOverlay() {
    restartAnimation(phaseTitleOverlay, 'is-fading-in')
    return wait(TRANSITION_FADE_TO_WHITE_DURATION)
}

function fadeOutOverlay() {
    restartAnimation(phaseTitleOverlay, 'is-fading-out')
    return wait(TRANSITION_OVERLAY_FADE_OUT_DURATION)
}

function dropTextIn() {
    restartAnimation(phaseTitleText, 'is-dropping')
    return wait(TRANSITION_TEXT_DROP_DURATION)
}

function leaveTextOut() {
    restartAnimation(phaseTitleText, 'is-leaving')
    return wait(TRANSITION_TEXT_LEAVE_DURATION)
}

// clear all transition state classes from the overlay and text
function clearTransitionClasses() {
    phaseTitleOverlay.classList.remove('is-fading-in', 'is-fading-out')
    phaseTitleText.classList.remove('is-dropping', 'is-leaving')
}

const SceneManager = {
    async goToScene(sceneName, showTitle = true) {
        if (isTransitioning) return
        isTransitioning = true

        try {
            if (!scenes[sceneName]) {
                console.error(`SceneManager: unknown scene "${sceneName}"`)
                return
            }

            const newScene = scenes[sceneName]
            const title = SCENE_TITLES[sceneName]

            // 1. Fade to white
            await fadeInOverlay()

            // 2. Text drops down (only when a title should be shown)
            if (title && showTitle) {
                phaseTitleText.textContent = title
                await dropTextIn()
            }

            // 3. Let the player read the text
            await wait(TRANSITION_TEXT_READ_DURATION)

            // 4. Hard scene swap + onEnter while the overlay is still active
            if (currentScene) {
                currentScene.onExit()
                currentScene.el.classList.remove('is-active')
            }
            currentScene = newScene
            currentScene.el.classList.add('is-active')
            currentScene.onEnter()

            // 5. Text leaves with its animation
            if (title && showTitle) {
                await leaveTextOut()
            }

            // 6. Overlay fades out revealing the new scene
            await fadeOutOverlay()
            clearTransitionClasses()
            phaseTitleText.textContent = ''
        } finally {
            isTransitioning = false
        }
    }
}

EventBus.on('scene:welcome', () => SceneManager.goToScene('welcome'))
EventBus.on('scene:characterSelect', () => SceneManager.goToScene('characterSelect'))
EventBus.on('scene:bet', () => SceneManager.goToScene('bet'))
EventBus.on('scene:gamePlay', () => SceneManager.goToScene('gamePlay'))
EventBus.on('scene:winner', () => SceneManager.goToScene('winner'))


export default SceneManager