import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Settings from './../../../data/settings.js'
import * as Characters from './../../../data/characters.js'
import { playSound } from './../core/Utils.js'


let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    confirmP1: null,
    confirmP2: null
}

export const el = document.querySelector('#scene-bet')

const betP1 = document.querySelector('#bet-p1')
const betP2 = document.querySelector('#bet-p2')
const controllerP1 = document.querySelector('#scene-bet .controller-p1')
const controllerP2 = document.querySelector('#scene-bet .controller-p2')

const betSymbol = ">"

export function onEnter() {
    p1Ready = false
    p2Ready = false;

    // set colors
    controllerP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    controllerP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    betP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    betP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color


    Array.prototype.forEach.call(document.querySelector('#scene-bet .controller-p1').children, el => {
        el.style.display = 'block'
    });

    Array.prototype.forEach.call(document.querySelector('#scene-bet .controller-p2').children, el => {
        el.style.display = 'block'
    });

    Store.players[0].bet = Settings.SETTINGS.gameMinBet
    Store.players[1].bet = Settings.SETTINGS.gameMinBet

    betP1.textContent = betP2.textContent = `${Store.players[0].bet} ${betSymbol} ${Store.players[0].bet * 2}`
    betP2.textContent = betP2.textContent = `${Store.players[1].bet} ${betSymbol} ${Store.players[1].bet * 2}`

    // bet up
    handlers.betUpP1 = () => {
        if(!p1Ready) {
            if(Store.players[0].bet < Settings.SETTINGS.gameMaxBet) {
                Store.players[0].bet += 1
            }

            playSound("./../../../assets/sounds/coin.mp3")

            betP1.textContent = `${Store.players[0].bet} ${betSymbol} ${Store.players[0].bet * 2}`
        }
    }

    handlers.betUpP2 = () => {
        if(!p2Ready) {
            if(Store.players[1].bet < Settings.SETTINGS.gameMaxBet) {
                Store.players[1].bet += 1
            }

            playSound("./../../../assets/sounds/coin.mp3")

            betP2.textContent = `${Store.players[1].bet} ${betSymbol} ${Store.players[1].bet * 2}`
        }
    }

    // bet down
    handlers.betDownP1 = () => {
        if(!p1Ready) {
            if(Store.players[0].bet > Settings.SETTINGS.gameMinBet) {
                Store.players[0].bet -= 1
            }

            playSound("./../../../assets/sounds/coin.mp3")

            betP1.textContent = `${Store.players[0].bet} ${betSymbol} ${Store.players[0].bet * 2}`
        }
    }

    handlers.betDownP2 = () => {
        if(!p2Ready) {
            if(Store.players[1].bet > Settings.SETTINGS.gameMinBet) {
                Store.players[1].bet -= 1
            }

            playSound("./../../../assets/sounds/coin.mp3")

            betP2.textContent = `${Store.players[1].bet} ${betSymbol} ${Store.players[1].bet * 2}`
        }
    }

    // confirm
    handlers.confirmP1 = () => {
        p1Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:gamePlay');

        Array.prototype.forEach.call(document.querySelector('#scene-bet .controller-p1').children, el => {
            el.classList.add('disabled')
        })

        playSound("./../../../assets/sounds/select.mp3")

    }
    handlers.confirmP2 = () => {
        p2Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:gamePlay');

        Array.prototype.forEach.call(document.querySelector('#scene-bet .controller-p2').children, el => {
            el.classList.add('disabled')
        })

        playSound("./../../../assets/sounds/select.mp3")
    }

    // bet up
    document.querySelector('#scene-bet .btn-B-p1').addEventListener('click', handlers.betUpP1)
    document.querySelector('#scene-bet .btn-B-p2').addEventListener('click', handlers.betUpP2)

    // bet down
    document.querySelector('#scene-bet .btn-A-p1').addEventListener('click', handlers.betDownP1)
    document.querySelector('#scene-bet .btn-A-p2').addEventListener('click', handlers.betDownP2)

    // confirm
    document.querySelector('#scene-bet .btn-select-p1').addEventListener('click', handlers.confirmP1)
    document.querySelector('#scene-bet .btn-select-p2').addEventListener('click', handlers.confirmP2)
}


export function onExit() {

    Array.prototype.forEach.call(document.querySelector('#scene-bet .controller-p1').children, el => {
        el.classList.remove('disabled')
    });

    Array.prototype.forEach.call(document.querySelector('#scene-bet .controller-p2').children, el => {
        el.classList.remove('disabled')
    });

    // bet up
    document.querySelector('#scene-bet .btn-B-p1').removeEventListener('click', handlers.betUpP1)
    document.querySelector('#scene-bet .btn-B-p2').removeEventListener('click', handlers.betUpP2)

    // bet down
    document.querySelector('#scene-bet .btn-A-p1').removeEventListener('click', handlers.betDownP1)
    document.querySelector('#scene-bet .btn-A-p2').removeEventListener('click', handlers.betDownP2)

    // confirm
    document.querySelector('#scene-bet .btn-select-p1').removeEventListener('click', handlers.confirmP1)
    document.querySelector('#scene-bet .btn-select-p2').removeEventListener('click', handlers.confirmP2);

}