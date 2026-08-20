import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Characters from '../../../data/characters.js'
import { playSound } from './../core/Utils.js'

let p1Ready = false
let p2Ready = false
let controller = null

const displaySelectionP1 = document.querySelector('#display-selection-p1')
const displaySelectionP2 = document.querySelector('#display-selection-p2')
const listCharacters = document.querySelector('#list-thumbnails')

export const el = document.querySelector('#scene-character-select')

export function onEnter() {
    p1Ready = false
    p2Ready = false
    controller = new AbortController()

    updateP1()
    updateP2()

    document.querySelector('#scene-character-select .btn-B-p1').addEventListener('click', () => {
        if(!p1Ready) {
            if (Store.players[0].character < Store.charactersCount - 1) Store.players[0].character++
            else Store.players[0].character = 0
            playSound("assets/sounds/click.mp3")
            updateP1()
        }
    }, { signal: controller.signal })

    document.querySelector('#scene-character-select .btn-A-p1').addEventListener('click', () => {
        if(!p1Ready) {
            if (Store.players[0].character > 0) Store.players[0].character--
            else Store.players[0].character = Store.charactersCount - 1
            playSound("assets/sounds/click.mp3")
            updateP1()
        }
    }, { signal: controller.signal })

    document.querySelector('#scene-character-select .btn-B-p2').addEventListener('click', () => {
        if(!p2Ready) {
            if (Store.players[1].character < Store.charactersCount - 1) Store.players[1].character++
            else Store.players[1].character = 0
            playSound("assets/sounds/click.mp3")
            updateP2()
        }
    }, { signal: controller.signal })

    document.querySelector('#scene-character-select .btn-A-p2').addEventListener('click', () => {
        if(!p2Ready) {
            if (Store.players[1].character > 0) Store.players[1].character--
            else Store.players[1].character = Store.charactersCount - 1
            playSound("assets/sounds/click.mp3")
            updateP2()
        }
    }, { signal: controller.signal })

    document.querySelector('#scene-character-select .btn-select-p1').addEventListener('click', () => {
        if(!p1Ready) {
            p1Ready = true
            Store.players[0].skills = { ...Characters.CHARACTERS[Store.players[0].character].skills }

            Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p1').children, el => {
                el.classList.add('disabled')
            })

            playSound("assets/sounds/select.mp3")
        }

        if (p1Ready && p2Ready) {
            EventBus.emit('scene:bet')
        }
    }, { signal: controller.signal })

    document.querySelector('#scene-character-select .btn-select-p2').addEventListener('click', () => {
        if(!p2Ready) {
            p2Ready = true
            Store.players[1].skills = { ...Characters.CHARACTERS[Store.players[1].character].skills }

            Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p2').children, el => {
                el.classList.add('disabled')
            })

            playSound("assets/sounds/select.mp3")
        }

        if (p1Ready && p2Ready) {
            EventBus.emit('scene:bet')
        }
    }, { signal: controller.signal })
}

export function onExit() {
    controller.abort()

    Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p1').children, el => {
        el.classList.remove('disabled')
    })

    Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p2').children, el => {
        el.classList.remove('disabled')
    })
}

function updateP1() {

    // selection display
    Array.prototype.forEach.call(displaySelectionP1.children, el => {
        el.classList.remove('active')
    })

    displaySelectionP1.children[Store.players[0].character].classList.add('active')


    // thumbnail list
    Array.prototype.forEach.call(listCharacters.children, el => {
        el.classList.remove('p1-selection')
    })

    listCharacters.children[Store.players[0].character].classList.add('p1-selection')
}

function updateP2() {

    // selection display
    Array.prototype.forEach.call(displaySelectionP2.children, el => {
        el.classList.remove('active')
    })

    displaySelectionP2.children[Store.players[1].character].classList.add('active')

    // thumbnail list
    Array.prototype.forEach.call(listCharacters.children, el => {
        el.classList.remove('p2-selection')
    })

    listCharacters.children[Store.players[1].character].classList.add('p2-selection')
}