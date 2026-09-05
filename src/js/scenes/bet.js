import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Settings from './../../../data/settings.js'
import * as Characters from './../../../data/characters.js'
import { playSound } from './../core/Audio.js'

let p1Ready = false
let p2Ready = false
let controller = null

export const el = document.querySelector('#scene-bet')

const betP1 = document.querySelector('#bet-p1')
const betP2 = document.querySelector('#bet-p2')
const controllerP1 = document.querySelector('#scene-bet .controller-p1')
const controllerP2 = document.querySelector('#scene-bet .controller-p2')

const betSymbol = ">"

const btnAP1 = document.querySelector('#scene-bet .btn-A-p1')
const btnAP2 = document.querySelector('#scene-bet .btn-A-p2')
const btnBP1 = document.querySelector('#scene-bet .btn-B-p1')
const btnBP2 = document.querySelector('#scene-bet .btn-B-p2')
const btnSelectP1 = document.querySelector('#scene-bet .btn-select-p1')
const btnSelectP2 = document.querySelector('#scene-bet .btn-select-p2')

function updateBetButtonsDisabledState() {
    const minBet = Settings.SETTINGS.gameMinBet
    const maxBet = Settings.SETTINGS.gameMaxBet

    // bet down (-) disabled when at min OR player ready
    btnAP1.classList.toggle('disabled', Store.players[0].bet <= minBet || p1Ready)
    btnAP2.classList.toggle('disabled', Store.players[1].bet <= minBet || p2Ready)

    // bet up (+) disabled when at max OR player ready
    btnBP1.classList.toggle('disabled', Store.players[0].bet >= maxBet || p1Ready)
    btnBP2.classList.toggle('disabled', Store.players[1].bet >= maxBet || p2Ready)

    // select button disabled when player ready
    btnSelectP1.classList.toggle('disabled', p1Ready)
    btnSelectP2.classList.toggle('disabled', p2Ready)
}

export function onEnter() {
    p1Ready = false
    p2Ready = false
    if (controller) controller.abort()
    controller = new AbortController()

    // set colors
    controllerP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    controllerP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    betP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    betP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    Array.prototype.forEach.call(controllerP1.children, el => {
        el.style.display = 'block'
    })

    Array.prototype.forEach.call(controllerP2.children, el => {
        el.style.display = 'block'
    })

    Store.players[0].bet = Settings.SETTINGS.gameMinBet
    Store.players[1].bet = Settings.SETTINGS.gameMinBet

    betP1.textContent = `${Store.players[0].bet} ${betSymbol} ${Store.players[0].bet * 2}`
    betP2.textContent = `${Store.players[1].bet} ${betSymbol} ${Store.players[1].bet * 2}`

    updateBetButtonsDisabledState()

    // bet up p1
    btnBP1.addEventListener('click', () => {
        if(!p1Ready) {
            if(Store.players[0].bet >= Settings.SETTINGS.gameMaxBet) return
            Store.players[0].bet += 1
            playSound("assets/sounds/coin.mp3")
            betP1.textContent = `${Store.players[0].bet} ${betSymbol} ${Store.players[0].bet * 2}`
            updateBetButtonsDisabledState()
        }
    }, { signal: controller.signal })

    // bet up p2
    btnBP2.addEventListener('click', () => {
        if(!p2Ready) {
            if(Store.players[1].bet >= Settings.SETTINGS.gameMaxBet) return
            Store.players[1].bet += 1
            playSound("assets/sounds/coin.mp3")
            betP2.textContent = `${Store.players[1].bet} ${betSymbol} ${Store.players[1].bet * 2}`
            updateBetButtonsDisabledState()
        }
    }, { signal: controller.signal })

    // bet down p1
    btnAP1.addEventListener('click', () => {
        if(!p1Ready) {
            if(Store.players[0].bet <= Settings.SETTINGS.gameMinBet) return
            Store.players[0].bet -= 1
            playSound("assets/sounds/grab-coin.mp3")
            betP1.textContent = `${Store.players[0].bet} ${betSymbol} ${Store.players[0].bet * 2}`
            updateBetButtonsDisabledState()
        }
    }, { signal: controller.signal })

    // bet down p2
    btnAP2.addEventListener('click', () => {
        if(!p2Ready) {
            if(Store.players[1].bet <= Settings.SETTINGS.gameMinBet) return
            Store.players[1].bet -= 1
            playSound("assets/sounds/grab-coin.mp3")
            betP2.textContent = `${Store.players[1].bet} ${betSymbol} ${Store.players[1].bet * 2}`
            updateBetButtonsDisabledState()
        }
    }, { signal: controller.signal })

    // confirm p1
    btnSelectP1.addEventListener('click', () => {
        if(!p1Ready) {
            p1Ready = true
            updateBetButtonsDisabledState()
            playSound("assets/sounds/select.mp3")

            if (p1Ready && p2Ready) EventBus.emit('scene:gamePlay')
        }
    }, { signal: controller.signal })

    // confirm p2
    btnSelectP2.addEventListener('click', () => {
        if(!p2Ready) {
            p2Ready = true
            updateBetButtonsDisabledState()
            playSound("assets/sounds/select.mp3")

            if (p1Ready && p2Ready) EventBus.emit('scene:gamePlay')
        }
    }, { signal: controller.signal })
}

export function onExit() {
    controller.abort()

    Array.prototype.forEach.call(controllerP1.children, el => {
        el.classList.remove('disabled')
    })

    Array.prototype.forEach.call(controllerP2.children, el => {
        el.classList.remove('disabled')
    })
}