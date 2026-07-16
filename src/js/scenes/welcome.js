import EventBus from '../core/EventBus.js'
import { resetStore } from '../core/Store.js'
import { playSound } from './../core/Utils.js'

let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    clickP1: null,
    clickP2: null
}

export const el = document.querySelector('#scene-welcome')

const btnStartP1 = document.querySelector('#scene-welcome .btn-select-p1')
const btnStartP2 = document.querySelector('#scene-welcome .btn-select-p2')

export function onEnter() {
    resetStore()
    
    p1Ready = false
    p2Ready = false

    handlers.clickP1 = () => {
        p1Ready = true
        btnStartP1.classList.add('disabled')

        playSound("./../../../assets/sounds/select.mp3")

        if (p1Ready && p2Ready) EventBus.emit('scene:characterSelect')
    }
    handlers.clickP2 = () => {
        p2Ready = true
        btnStartP2.classList.add('disabled')

        playSound("./../../../assets/sounds/select.mp3")
        
        if (p1Ready && p2Ready) EventBus.emit('scene:characterSelect')
    }

    document.querySelector('#scene-welcome .btn-select-p1').addEventListener('click', handlers.clickP1)
    document.querySelector('#scene-welcome .btn-select-p2').addEventListener('click', handlers.clickP2)
}

export function onExit() {
    document.querySelector('#scene-welcome .btn-select-p1').removeEventListener('click', handlers.clickP1)
    document.querySelector('#scene-welcome .btn-select-p2').removeEventListener('click', handlers.clickP2)
    btnStartP1.classList.remove('disabled')
    btnStartP2.classList.remove('disabled')
}