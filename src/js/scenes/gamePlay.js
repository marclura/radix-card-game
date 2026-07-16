import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Cards from './../../../data/cards.js'
import * as Settings from './../../../data/settings.js'
import * as Characters from './../../../data/characters.js'
import { generateCharacterCard, translateSkillKey, formatSeconds } from './../core/Utils.js'

let currentTurn = 0 // player 0 or 1

const handlers = {  // list of event listeners
    
}

export const el = document.querySelector('#scene-game-play')

const pointsP1 = document.querySelector('#scene-game-play #points-p1')
const pointsP2 = document.querySelector('#scene-game-play #points-p2')

const characterP1 = document.querySelector('#scene-game-play #game-character-p1')
const characterP2 = document.querySelector('#scene-game-play #game-character-p2')

const cardDecksP1 = document.querySelector('#scene-game-play #card-decks-p1')
const cardDecksP2 = document.querySelector('#scene-game-play #card-decks-p2')

const cardMessage = document.querySelector('#scene-game-play #card-message')
const cardPoints = document.querySelector('#scene-game-play #card-points')

const gameTimeBar = document.querySelector('#scene-game-play #game-time-bar')



export function onEnter() {

    pointsP1.textContent = Store.players[0].score
    pointsP2.textContent = Store.players[1].score

    cardDecksP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    cardDecksP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    pointsP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    pointsP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    console.log(generateCharacterCard(Store.players[0].character))


    characterP1.append(generateCharacterCard(Store.players[0].character))
    characterP2.append(generateCharacterCard(Store.players[1].character))

    currentTurn = Math.round(Math.random())
    updateGUI()

    handlers.drawCardP1 = () => {
        if(currentTurn === 0) {
            drawCard(Store.players[0])
            pointsP1.textContent = Store.players[0].score

            changeTurn()
        }
    }

    handlers.drawCardP2 = () => {
        if(currentTurn === 1) {
            drawCard(Store.players[1])
            pointsP2.textContent = Store.players[1].score
            changeTurn()
        }
    }

    handlers.gameIsOver = () => {
        console.log("gameIsOver")
        EventBus.emit('scene:winner')
    }

    startTimer(handlers.gameIsOver)

    document.querySelector('#card-deck-1-p1').addEventListener('click', handlers.drawCardP1)
    document.querySelector('#card-deck-2-p1').addEventListener('click', handlers.drawCardP1)
    document.querySelector('#card-deck-3-p1').addEventListener('click', handlers.drawCardP1)

    document.querySelector('#card-deck-1-p2').addEventListener('click', handlers.drawCardP2)
    document.querySelector('#card-deck-2-p2').addEventListener('click', handlers.drawCardP2)
    document.querySelector('#card-deck-3-p2').addEventListener('click', handlers.drawCardP2)
}

function drawCard(player) {
    const randomId = Math.floor(Math.random() * Cards.CARDS.length)
    const card = Cards.CARDS[randomId]

    // card message
    cardMessage.textContent = card.message

    // card points
    cardPoints.textContent = (card.score > 0) ? `+${card.score}` : card.score

    // score
    player.score += card.score
    /*
    if(player.score < Settings.SETTINGS.gameMinPoints) player.score = 0
    if(player.score > Settings.SETTINGS.gameMaxPoints) player.score = 0
    */

    // skills update
    player.skills = Object.fromEntries(
        Object.entries(player.skills).map(([skill, value]) => {
            let _value = value + card.skills[skill]

            if(_value > 1.0) _value = 1.0
            if(_value < 0.0) _value = 0
            return [skill, _value]})
    );

    console.log(player.skills)


}

function changeTurn() {
    currentTurn = 1 - currentTurn   // toggle 1 to 0 and viceversa
    updateGUI()
}

function updateGUI() {
    if(currentTurn === 1) {
        document.querySelector("#scene-game-play .controller-p1").classList.add('not-current-turn')
        document.querySelector("#scene-game-play .controller-p2").classList.remove('not-current-turn')
    }
    else {
        document.querySelector("#scene-game-play .controller-p1").classList.remove('not-current-turn')
        document.querySelector("#scene-game-play .controller-p2").classList.add('not-current-turn')
    } 
}

function startTimer(callback) {

    let remaining = Settings.SETTINGS.gamePlayDuration

    gameTimeBar.textContent = formatSeconds(remaining)

    const interval = setInterval(() => {
        remaining--
        const percentage = (remaining / Settings.SETTINGS.gamePlayDuration) * 100
        gameTimeBar.style.width = percentage + '%';

        gameTimeBar.textContent = formatSeconds(remaining)

        if(remaining <= 0) {
            clearInterval(interval)
            callback()
        }
    }, 1000)
}


export function onExit() {
    gameTimeBar.style.width = '100%'
    
    document.querySelector('#card-deck-1-p1').removeEventListener('click', handlers.drawCardP1)
    document.querySelector('#card-deck-2-p1').removeEventListener('click', handlers.drawCardP1)
    document.querySelector('#card-deck-3-p1').removeEventListener('click', handlers.drawCardP1)

    document.querySelector('#card-deck-1-p2').removeEventListener('click', handlers.drawCardP2)
    document.querySelector('#card-deck-2-p2').removeEventListener('click', handlers.drawCardP2)
    document.querySelector('#card-deck-3-p2').removeEventListener('click', handlers.drawCardP2)
}