import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Characters from './../../../data/characters.js'
import { generateCharacterCard, translateSkillKey, formatSeconds, playSound } from './../core/Utils.js'

let p1Ready = false
let p2Ready = false
let controller = null

export const el = document.querySelector('#scene-winner')

const btnRestartP1 = document.querySelector('#scene-winner .btn-select-p1')
const btnRestartP2 = document.querySelector('#scene-winner .btn-select-p2')

const winnerMessage = document.querySelector('#scene-winner #winner-message')

const characterP1 = document.querySelector('#scene-winner #game-character-p1')

export function onEnter() {
    p1Ready = false
    p2Ready = false
    controller = new AbortController()

    const p1 = Store.players[0]
    const p2 = Store.players[1]

    let winner
    if (p1.score > p2.score) {
        winner = 0
    } else if (p2.score > p1.score) {
        winner = 1
    } else {
        // tie
        winnerMessage.textContent = `Pareggio! ${Characters.CHARACTERS[p1.character].name} e ${Characters.CHARACTERS[p2.character].name} terminano alla pari con ${p1.score} punti!`
        return
    }

    winnerMessage.textContent = `${Characters.CHARACTERS[Store.players[winner].character].name} vince con ${Store.players[winner].score} punti e guadagna ${Store.players[winner].bet * 2} gettoni!`
    //characterP1.append(generateCharacterCard(Store.players[winner].character))

    btnRestartP1.addEventListener('click', () => {
        p1Ready = true
        btnRestartP1.classList.add('disabled')
        playSound("assets/sounds/select.mp3")

        if (p1Ready && p2Ready) EventBus.emit('scene:welcome')
    }, { signal: controller.signal })

    btnRestartP2.addEventListener('click', () => {
        p2Ready = true
        btnRestartP2.classList.add('disabled')
        playSound("assets/sounds/select.mp3")

        if (p1Ready && p2Ready) EventBus.emit('scene:welcome')
    }, { signal: controller.signal })
}

export function onExit() {
    controller.abort()
    btnRestartP1.classList.remove('disabled')
    btnRestartP2.classList.remove('disabled')
}