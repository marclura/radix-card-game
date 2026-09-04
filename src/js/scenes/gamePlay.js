import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Cards from './../../../data/cards.js'
import * as Settings from './../../../data/settings.js'
import * as Characters from './../../../data/characters.js'
import { generateCharacterCard, translateSkillKey, formatSeconds } from './../core/Utils.js'
import { playSound, preloadSounds } from './../core/Audio.js'

// ===== animation parameters (tweak here) =====
const ANIM = {
    cardRiseDuration: 500,      // ms - match $card-rise-duration in stylus
    turnSwitchDelay: 1200,       // ms - fallback delay when audio is unavailable (locked/failed)
    previousOffsetRange: 14,    // px range for random offset of previous cards
    previousRotationRange: 8,   // deg range for random rotation of previous cards
}

// sounds used during gameplay - preloaded in onEnter so the first
// card draw has no fetch/decode latency
const GAMEPLAY_SOUNDS = [
    'assets/sounds/play-positive.mp3',
    'assets/sounds/play-ok.mp3',
    'assets/sounds/negative.mp3',
    'assets/sounds/countdown-tick.mp3',
    'assets/sounds/gong.mp3',
]

let currentTurn = 0 // player 0 or 1
let isProcessing = false // lock to prevent multiple clicks during turn switch delay
let gameEnded = false // set to true when the countdown reaches 0
let controller = null

export const el = document.querySelector('#scene-game-play')

const pointsP1 = document.querySelector('#scene-game-play #points-p1')
const pointsP2 = document.querySelector('#scene-game-play #points-p2')

const characterP1 = document.querySelector('#scene-game-play #game-character-p1')
const characterP2 = document.querySelector('#scene-game-play #game-character-p2')

const cardDecksP1 = document.querySelector('#scene-game-play #card-decks-p1')
const cardDecksP2 = document.querySelector('#scene-game-play #card-decks-p2')

const cardRevealStack = document.querySelector('#scene-game-play #card-reveal-stack')

const gameTimeBar = document.querySelector('#scene-game-play #game-time-bar')

let timerInterval = null

export function onEnter() {

    pointsP1.textContent = Store.players[0].score
    pointsP2.textContent = Store.players[1].score

    cardDecksP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    cardDecksP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    pointsP1.dataset.color = Characters.CHARACTERS[Store.players[0].character].color
    pointsP2.dataset.color = Characters.CHARACTERS[Store.players[1].character].color

    // clear any previously appended character cards to avoid duplicates on re-entry
    characterP1.innerHTML = ''
    characterP2.innerHTML = ''
    characterP1.append(generateCharacterCard(Store.players[0].character))
    characterP2.append(generateCharacterCard(Store.players[1].character))

    // start with an empty stack
    cardRevealStack.innerHTML = ''

    currentTurn = Math.round(Math.random())
    isProcessing = false
    gameEnded = false
    updateGUI()

    // show initial "Inizia <character name>" as the first card in the stack
    const starterName = Characters.CHARACTERS[Store.players[currentTurn].character].name
    addDrawnCard(`Inizia ${starterName}`, null)

    controller = new AbortController()

    // warm up the sound cache so the first card draw has no latency
    preloadSounds(GAMEPLAY_SOUNDS)

    // single handler for all 6 card decks - the decks reactivate when the
    // drawn card's sound has finished playing (not on a fixed delay)
    for (const [playerIndex, deckIds] of [[0, ['#card-deck-1-p1', '#card-deck-2-p1', '#card-deck-3-p1']],
                                          [1, ['#card-deck-1-p2', '#card-deck-2-p2', '#card-deck-3-p2']]]) {
        for (const deckId of deckIds) {
            document.querySelector(deckId).addEventListener('click', () => {
                handleDeckClick(playerIndex)
            }, { signal: controller.signal })
        }
    }

    startTimer(() => {
        console.log("gameIsOver")
        EventBus.emit('scene:winner')
    })
}

// handle a click on any of the 6 card decks.
// the next player's decks are reactivated when the drawn card's sound has
// finished playing; the fixed delay is only a fallback for when audio is
// unavailable (autoplay policy or load failure).
async function handleDeckClick(playerIndex) {
    if (currentTurn !== playerIndex || isProcessing || gameEnded) return

    isProcessing = true
    lockCurrentPlayer()

    const { previousScore, playback } = drawCard(Store.players[playerIndex])
    updateSkillBars(playerIndex)
    animateScore(playerIndex === 0 ? pointsP1 : pointsP2, previousScore, Store.players[playerIndex].score)
    changeTurn()

    // wait for the sound to finish (resolves false when audio is unavailable)
    const played = await playback
    if (!played) await new Promise(resolve => setTimeout(resolve, ANIM.turnSwitchDelay))

    // once the game has ended (timer expiry during playback), never re-enable
    if (gameEnded) return

    updateGUI()
    isProcessing = false
}

function drawCard(player) {
    const randomId = Math.floor(Math.random() * Cards.CARDS.length)
    const card = Cards.CARDS[randomId]

    // positive
    let playback
    if(card.type == 'positive') playback = playSound("assets/sounds/play-positive.mp3")
    else if(card.type == 'special') playback = playSound("assets/sounds/play-ok.mp3")
    else if(card.type == 'negative') playback = playSound("assets/sounds/negative.mp3")
    else playback = Promise.resolve(false) // unknown card type: no sound

    // card points label
    const pointsLabel = (card.score > 0) ? `+${card.score}` : `${card.score}`

    // add drawn card with message + points (replaces visually the previous one)
    addDrawnCard(card.message, pointsLabel)

    // score
    const previousScore = player.score
    player.score += card.score

    // skills update
    player.skills = Object.fromEntries(
        Object.entries(player.skills).map(([skill, value]) => {
            let _value = value + card.skills[skill]

            if(_value > 1.0) _value = 1.0
            if(_value < 0.0) _value = 0
            return [skill, _value]})
    )

    return { previousScore, playback }
}

// Create a new .drawn-card and append it to the stack.
// Existing cards are never modified — only zIndex keeps stacking order.
// All cards remain in the stack (cleanup happens in onExit).
function addDrawnCard(message, pointsLabel) {
    const cards = cardRevealStack.querySelectorAll('.drawn-card')

    // existing cards stay untouched — only zIndex is updated to keep stacking order
    cards.forEach((c, i) => {
        c.style.zIndex = String(cards.length - i)
    })

    // create the new card on top with its own random position (assigned once)
    const cardEl = document.createElement('div')
    cardEl.classList.add('drawn-card')
    cardEl.style.zIndex = String(cards.length + 1)

    const px = (Math.random() - 0.5) * 2 * ANIM.previousOffsetRange
    const py = (Math.random() - 0.5) * 2 * ANIM.previousOffsetRange
    const pr = (Math.random() - 0.5) * 2 * ANIM.previousRotationRange
    cardEl.style.setProperty('--px', `${px}px`)
    cardEl.style.setProperty('--py', `${py}px`)
    cardEl.style.setProperty('--pr', `${pr}deg`)

    if (pointsLabel !== null && pointsLabel !== undefined) {
        const pointsEl = document.createElement('div')
        pointsEl.classList.add('drawn-card-points')
        pointsEl.textContent = pointsLabel
        cardEl.append(pointsEl)
    }

    const msgEl = document.createElement('div')
    msgEl.classList.add('drawn-card-message')
    msgEl.textContent = message
    cardEl.append(msgEl)

    cardRevealStack.append(cardEl)
}

// animate the score text incrementally from fromValue to toValue
function animateScore(element, fromValue, toValue, duration = 600) {
    const startTime = performance.now()

    function update(now) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = Math.round(fromValue + (toValue - fromValue) * progress)
        element.textContent = current

        if (progress < 1) {
            requestAnimationFrame(update)
        } else {
            element.textContent = toValue
        }
    }

    requestAnimationFrame(update)
}

function updateSkillBars(id) {
    const character = Store.players[id]

    let characterCard

    if (id === 0) {
        characterCard = document.querySelector('#game-character-p1')
    } else if (id === 1) {
        characterCard = document.querySelector('#game-character-p2')
    } else {
        console.error(`updateSkillBars: invalid player id ${id}`)
        return
    }

    // Select all skill entries
    characterCard.querySelectorAll('.skill-entry').forEach(entry => {
        const skillName = entry.dataset.skill
        const skillValue = character.skills[skillName]
        const skillBar = entry.querySelector('.skill-bar')

        if (skillBar) {
            skillBar.style.width = `${skillValue * 100}%`
        }
    })
}

// toggle the turn only (GUI is updated separately after turnSwitchDelay)
function changeTurn() {
    currentTurn = 1 - currentTurn   // toggle 1 to 0 and vice versa
}

// immediately disable the current player's decks visually during turn switch
function lockCurrentPlayer() {
    const currentSelector = currentTurn === 0 ? ".controller-p1" : ".controller-p2"
    document.querySelector(`#scene-game-play ${currentSelector}`).classList.add('not-current-turn')
    document.querySelectorAll(`#scene-game-play ${currentSelector} .card-deck`).forEach((el) => el.classList.add('disabled'))
}

function updateGUI() {
    // once the game has ended, never re-enable the decks
    if(gameEnded) return

    if(currentTurn === 1) {
        document.querySelector("#scene-game-play .controller-p1").classList.add('not-current-turn')
        document.querySelector("#scene-game-play .controller-p2").classList.remove('not-current-turn')
        document.querySelectorAll("#scene-game-play .controller-p1 .card-deck").forEach((el) => el.classList.add('disabled'))
        document.querySelectorAll("#scene-game-play .controller-p2 .card-deck").forEach((el) => el.classList.remove('disabled'))
    }
    else {
        document.querySelector("#scene-game-play .controller-p1").classList.remove('not-current-turn')
        document.querySelector("#scene-game-play .controller-p2").classList.add('not-current-turn')
        document.querySelectorAll("#scene-game-play .controller-p1 .card-deck").forEach((el) => el.classList.remove('disabled'))
        document.querySelectorAll("#scene-game-play .controller-p2 .card-deck").forEach((el) => el.classList.add('disabled'))
    }
}

function startTimer(callback) {

    let remaining = Settings.SETTINGS.gamePlayDuration

    gameTimeBar.textContent = formatSeconds(remaining)

    timerInterval = setInterval(() => {
        remaining--
        const percentage = (remaining / Settings.SETTINGS.gamePlayDuration) * 100
        gameTimeBar.style.width = percentage + '%'

        gameTimeBar.textContent = formatSeconds(remaining)

        // countdown tick during the last 10 seconds
        if(remaining <= 10 && remaining >= 1) {
            playSound('assets/sounds/countdown-tick.mp3')
        }

        if(remaining <= 0) {
            clearInterval(timerInterval)
            timerInterval = null

            // time is up: gong + lock both players' card decks
            playSound('assets/sounds/gong.mp3')
            gameEnded = true
            document.querySelector("#scene-game-play .controller-p1").classList.add('not-current-turn')
            document.querySelector("#scene-game-play .controller-p2").classList.add('not-current-turn')
            document.querySelectorAll("#scene-game-play .card-deck").forEach((el) => el.classList.add('disabled'))

            callback()
        }
    }, 1000)
}


export function onExit() {
    // stop the timer if it is still running
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
    gameTimeBar.style.width = '100%'

    // clear all drawn cards so the scene starts clean on re-entry
    cardRevealStack.innerHTML = ''

    controller.abort()
}