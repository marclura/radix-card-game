import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Cards from './../../../data/cards.js'
import * as Settings from './../../../data/settings.js'

const handlers = {  // list of event listeners
    
}

export const el = document.querySelector('#scene-game-play')

const pointsP1 = document.querySelector('#scene-game-play #points-p1')
const pointsP2 = document.querySelector('#scene-game-play #points-p2')
const cardMessage = document.querySelector('#scene-game-play #card-message')
const cardPoints = document.querySelector('#scene-game-play #card-points')
const gameTimeBar = document.querySelector('#scene-game-play #game-time-bar')

export function onEnter() {

    pointsP1.textContent = Store.players[0].points
    pointsP2.textContent = Store.players[1].points

    handlers.drawCardP1 = () => {
        drawCard(Store.players[0])
        pointsP1.textContent = Store.players[0].points
    }

    handlers.drawCardP2 = () => {
        drawCard(Store.players[1])
        pointsP2.textContent = Store.players[1].points
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
    cardPoints.textContent = (card.points.scores > 0) ? `+${card.points.scores}` : card.points.scores

    // points
    player.points += card.points.scores
    if(player.points < Settings.SETTINGS.gameMinPoints) player.points = 0
    if(player.points > Settings.SETTINGS.gameMaxPoints) player.points = 0

}

function startTimer(callback) {

    let remaining = Settings.SETTINGS.gamePlayDuration

    gameTimeBar.textContent = remaining

    const interval = setInterval(() => {
        remaining--
        const percentage = (remaining / Settings.SETTINGS.gamePlayDuration) * 100
        gameTimeBar.style.width = percentage + '%';

        gameTimeBar.textContent = remaining

        if(remaining <= 0) {
            clearInterval(interval)
            callback()
        }
    }, 1000)
}


export function onExit() {
    document.querySelector('#card-deck-1-p1').removeEventListener('click', handlers.drawCardP1)
    document.querySelector('#card-deck-2-p1').removeEventListener('click', handlers.drawCardP1)
    document.querySelector('#card-deck-3-p1').removeEventListener('click', handlers.drawCardP1)

    document.querySelector('#card-deck-1-p2').removeEventListener('click', handlers.drawCardP2)
    document.querySelector('#card-deck-2-p2').removeEventListener('click', handlers.drawCardP2)
    document.querySelector('#card-deck-3-p2').removeEventListener('click', handlers.drawCardP2)
}