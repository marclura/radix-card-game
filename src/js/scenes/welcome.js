import EventBus from '../core/EventBus.js'
import { resetStore } from '../core/Store.js'
import { playSound } from './../core/Audio.js'

let p1Ready = false
let p2Ready = false
let controller = null

export const el = document.querySelector('#scene-welcome')

const btnStartP1 = document.querySelector('#scene-welcome .btn-select-p1')
const btnStartP2 = document.querySelector('#scene-welcome .btn-select-p2')

export function onEnter() {
    resetStore()

    p1Ready = false
    p2Ready = false
    controller = new AbortController()

    btnStartP1.addEventListener('click', () => {
        p1Ready = true
        btnStartP1.classList.add('disabled')

        playSound("assets/sounds/select.mp3")

        if (p1Ready && p2Ready) EventBus.emit('scene:characterSelect')
    }, { signal: controller.signal })

    btnStartP2.addEventListener('click', () => {
        p2Ready = true
        btnStartP2.classList.add('disabled')

        playSound("assets/sounds/select.mp3")

        if (p1Ready && p2Ready) EventBus.emit('scene:characterSelect')
    }, { signal: controller.signal })
}

export function onExit() {
    controller.abort()
    btnStartP1.classList.remove('disabled')
    btnStartP2.classList.remove('disabled')
}