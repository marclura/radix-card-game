import EventBus from '../core/EventBus.js'

let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    confirmP1: null,
    confirmP2: null
}

export const el = document.querySelector('#scene-winner')

export function onEnter() {
    p1Ready = false
    p2Ready = false

    handlers.confirmP1 = () => {
        p1Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:welcome')
    }
    handlers.confirmP2 = () => {
        p2Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:welcome')
    }

    document.querySelector('#btn-restart-p1').addEventListener('click', handlers.confirmP1)
    document.querySelector('#btn-restart-p2').addEventListener('click', handlers.confirmP2)
}


export function onExit() {
    document.querySelector('#btn-restart-p1').removeEventListener('click', handlers.confirmP1)
    document.querySelector('#btn-restart-p2').removeEventListener('click', handlers.confirmP2)
}