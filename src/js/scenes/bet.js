import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Settings from './../../../data/settings.js'

let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    confirmP1: null,
    confirmP2: null
}

export const el = document.querySelector('#scene-bet')

const betP1 = document.querySelector('#bet-p1')
const betP2 = document.querySelector('#bet-p2')

export function onEnter() {
    p1Ready = false
    p2Ready = false;

    [...document.querySelector('#scene-bet .controller-p1').children].forEach(el => {
        el.style.display = 'block'
    });

    [...document.querySelector('#scene-bet .controller-p2').children].forEach(el => {
        el.style.display = 'block'
    });

    Store.players[0].bet = Settings.SETTINGS.gameMinBet
    Store.players[1].bet = Settings.SETTINGS.gameMinBet

    betP1.textContent = betP2.textContent = `${Store.players[0].bet} → ${Store.players[0].bet * 2}`
    betP2.textContent = betP2.textContent = `${Store.players[1].bet} → ${Store.players[1].bet * 2}`

    // bet up
    handlers.betUpP1 = () => {
        if(Store.players[0].bet < Settings.SETTINGS.gameMaxBet) {
            Store.players[0].bet += 1
        }
        betP1.textContent = `${Store.players[0].bet} → ${Store.players[0].bet * 2}`
    }

    handlers.betUpP2 = () => {
        if(Store.players[1].bet < Settings.SETTINGS.gameMaxBet) {
            Store.players[1].bet += 1
        }
        betP2.textContent = `${Store.players[1].bet} → ${Store.players[1].bet * 2}`
    }

    // bet down
    handlers.betDownP1 = () => {
        if(Store.players[0].bet > Settings.SETTINGS.gameMinBet) {
            Store.players[0].bet -= 1
        }
        betP1.textContent = `${Store.players[0].bet} → ${Store.players[0].bet * 2}`
    }

    handlers.betDownP2 = () => {
        if(Store.players[1].bet > Settings.SETTINGS.gameMinBet) {
            Store.players[1].bet -= 1
        }
        betP2.textContent = `${Store.players[1].bet} → ${Store.players[1].bet * 2}`
    }

    // confirm
    handlers.confirmP1 = () => {
        p1Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:gamePlay');

        [...document.querySelector('#scene-bet .controller-p1').children].forEach(el => {
            el.style.display = 'none'
        })
    }
    handlers.confirmP2 = () => {
        p2Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:gamePlay');

        [...document.querySelector('#scene-bet .controller-p2').children].forEach(el => {
            el.style.display = 'none'
        })
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

    [...document.querySelector('#scene-bet .controller-p1').children].forEach(el => {
        el.style.display = 'block'
    });

    [...document.querySelector('#scene-bet .controller-p2').children].forEach(el => {
        el.style.display = 'block'
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