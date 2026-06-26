import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'

let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    confirmP1: null,
    confirmP2: null
}

export const el = document.querySelector('#scene-winner')

const winnerMessage = document.querySelector('#scene-winner #winner-message')

export function onEnter() {
    p1Ready = false
    p2Ready = false

    let winner

    if(Store.players[0].points > Store.players[1].points) {
        winner = 0
    }
    else {
        winner = 1
    }

    winnerMessage.textContent = `Il vincitore è Player ${winner + 1} con ${Store.players[winner].points} punti che si porta a casa ${Store.players[winner].bet * 2} gettoni!`

    handlers.confirmP1 = () => {
        p1Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:welcome')
    }
    handlers.confirmP2 = () => {
        p2Ready = true
        if (p1Ready && p2Ready) EventBus.emit('scene:welcome')
    }

    document.querySelector('#scene-winner .btn-select-p1').addEventListener('click', handlers.confirmP1)
    document.querySelector('#scene-winner .btn-select-p2').addEventListener('click', handlers.confirmP2)
}


export function onExit() {
    document.querySelector('#scene-winner .btn-select-p1').removeEventListener('click', handlers.confirmP1)
    document.querySelector('#scene-winner .btn-select-p2').removeEventListener('click', handlers.confirmP2)
}