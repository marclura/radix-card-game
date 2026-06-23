import EventBus from '../core/EventBus.js'
import { resetStore } from '../core/Store.js'

let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    clickP1: null,
    clickP2: null
}

export const el = document.querySelector('#scene-welcome')

export function onEnter() {
    resetStore()
    
    p1Ready = false
    p2Ready = false

    handlers.clickP1 = () => {
        p1Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:characterSelect')
    }
    handlers.clickP2 = () => {
        p2Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:characterSelect')
    }

    document.querySelector('#scene-welcome .btn-select-p1').addEventListener('click', handlers.clickP1)
    document.querySelector('#scene-welcome .btn-select-p2').addEventListener('click', handlers.clickP2)
}

export function onExit() {
    document.querySelector('#scene-welcome .btn-select-p1').removeEventListener('click', handlers.clickP1)
    document.querySelector('#scene-welcome .btn-select-p2').removeEventListener('click', handlers.clickP2)
}