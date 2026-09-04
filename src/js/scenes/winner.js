import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Characters from './../../../data/characters.js'
import { generateCharacterCard } from './../core/Utils.js'
import { playSound, playTickSound } from './../core/Audio.js'

// ===== animation parameters (tweak here) =====
const ANIM = {
    soundDelay: 600,          // ms - delay before the winner sound starts
    boardSlideDuration: 1200,  // ms - winner-board slide-in from the bottom duration
    boardSlideDelay: 800,     // ms - pause after a board lands, before its values animate
    fichesDelay: 1000,        // ms - pause after the board lands, before the fiches animation
    fichesDuration: 1500,     // ms - fiches count up/down duration
    centerMessageDelay: 1800,  // ms - pause before the central message appears
}

// central messages (editable from JS - shown at different steps of the sequence)
const MSG_WINNER = 'Vinci il doppio delle fishes puntate!'   // shown when the winner board is in position
const MSG_LOSER = 'Hai perso tutto!'                // shown when the loser board is in position
const MSG_END = 'Il gioco è terminato!'  // shown with the restart buttons

let p1Ready = false
let p2Ready = false
let controller = null

// pending timeouts + animation frame ids, cleared on scene exit
let pendingTimeouts = []
let pendingFrames = []
// token to invalidate callbacks from a previous scene entry
let entryToken = 0

export const el = document.querySelector('#scene-winner')

const btnRestartP1 = document.querySelector('#scene-winner .btn-select-p1')
const btnRestartP2 = document.querySelector('#scene-winner .btn-select-p2')

const boardP1 = document.querySelector('#scene-winner #winner-board-p1')
const boardP2 = document.querySelector('#scene-winner #winner-board-p2')

const characterP1 = document.querySelector('#scene-winner #winner-character-p1')
const characterP2 = document.querySelector('#scene-winner #winner-character-p2')

const finalScoreP1 = document.querySelector('#scene-winner #final-score-p1')
const finalScoreP2 = document.querySelector('#scene-winner #final-score-p2')

const betP1 = document.querySelector('#scene-winner #winner-bet-p1')
const betP2 = document.querySelector('#scene-winner #winner-bet-p2')

const centerMessage = document.querySelector('#scene-winner #winner-center')

// expose the board slide duration as a CSS custom property used by the Stylus transition
el.style.setProperty('--board-slide-duration', `${ANIM.boardSlideDuration}ms`)

// per-player element bundles (index matches the player index)
const boards = [boardP1, boardP2]
const bets = [betP1, betP2]

// wait ms, but cancellable on scene exit
function wait(ms) {
    return new Promise(resolve => {
        const id = setTimeout(() => {
            pendingTimeouts = pendingTimeouts.filter(t => t !== id)
            resolve()
        }, ms)
        pendingTimeouts.push(id)
    })
}

// animate a numeric element incrementally from fromValue to toValue
// optionally plays a tick sound each time the displayed value changes
// resolves when the animation finishes
function animateValue(element, fromValue, toValue, duration, soundFile = null) {
    return new Promise(resolve => {
        const startTime = performance.now()
        let lastValue = fromValue

        function update(now) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const current = Math.round(fromValue + (toValue - fromValue) * progress)
            element.textContent = current

            // play a tick each time the displayed value changes
            if (soundFile && current !== lastValue) {
                playTickSound(soundFile)
                lastValue = current
            }

            if (progress < 1) {
                const frameId = requestAnimationFrame(update)
                pendingFrames.push(frameId)
            } else {
                element.textContent = toValue
                resolve()
            }
        }

        pendingFrames.push(requestAnimationFrame(update))
    })
}

// set the central message lines from JS (each line becomes a <p>)
export function setCenterMessage(lines) {
    centerMessage.innerHTML = ''
    lines.forEach(text => {
        const p = document.createElement('p')
        p.textContent = text
        centerMessage.append(p)
    })
}

// make a winner-board slide in from the bottom of the screen
function showBoard(board) {
    board.classList.remove('is-offscreen')
}

// reveal the central message
function showCenter() {
    centerMessage.classList.add('is-visible')
}

// hide the central message (fades out via the CSS opacity transition)
function hideCenter() {
    centerMessage.classList.remove('is-visible')
}

// reveal the restart buttons
function revealButtons() {
    btnRestartP1.classList.remove('is-hidden')
    btnRestartP2.classList.remove('is-hidden')
}

export function onEnter() {
    p1Ready = false
    p2Ready = false
    controller = new AbortController()

    // invalidate any callbacks from a previous entry and reset the pending lists
    entryToken++
    const token = entryToken
    pendingTimeouts = []
    pendingFrames = []

    const p1 = Store.players[0]
    const p2 = Store.players[1]

    // character colors
    characterP1.dataset.color = Characters.CHARACTERS[p1.character].color
    characterP2.dataset.color = Characters.CHARACTERS[p2.character].color
    finalScoreP1.dataset.color = Characters.CHARACTERS[p1.character].color
    finalScoreP2.dataset.color = Characters.CHARACTERS[p2.character].color
    betP1.dataset.color = Characters.CHARACTERS[p1.character].color
    betP2.dataset.color = Characters.CHARACTERS[p2.character].color

    // clear any previously appended character cards to avoid duplicates on re-entry
    characterP1.innerHTML = ''
    characterP2.innerHTML = ''
    characterP1.append(generateCharacterCard(p1.character))
    characterP2.append(generateCharacterCard(p2.character))

    // hide the boards (they slide in from the bottom during the sequence)
    boards.forEach(board => board.classList.add('is-offscreen'))

    // hide the central message (each step of the sequence sets its own content)
    centerMessage.classList.remove('is-visible')
    setCenterMessage([])

    // hide the restart buttons until the animations are done
    btnRestartP1.classList.add('is-hidden')
    btnRestartP2.classList.add('is-hidden')

    // determine the winner
    let winner = -1 // -1 = tie
    if (p1.score > p2.score) {
        winner = 0
    } else if (p2.score > p1.score) {
        winner = 1
    }

    // initial values (the final score is displayed directly, no count-up)
    finalScoreP1.textContent = p1.score
    finalScoreP2.textContent = p2.score
    betP1.textContent = p1.bet
    betP2.textContent = p2.bet

    // ===== animation sequence =====
    // 1. sound delay -> 2. winner board slides in (+ winner message)
    // -> 3. winner fiches -> 4. loser board slides in (message hidden)
    // -> 5. loser fiches (+ loser message)
    // -> 6. end message -> 7. reveal buttons
    ;(async () => {
        // 1. small delay before the winner sound starts
        await wait(ANIM.soundDelay)
        if (token !== entryToken) return
        playSound("assets/sounds/winner.mp3")

        if (winner === -1) {
            // tie: both boards slide in (score already displayed), no fiches animation
            for (const i of [0, 1]) {
                // board slides in from the bottom
                showBoard(boards[i])
                await wait(ANIM.boardSlideDuration + ANIM.boardSlideDelay)
                if (token !== entryToken) return
            }
        } else {
            const w = winner
            const l = 1 - winner

            // 2. winner board slides in from the bottom
            showBoard(boards[w])
            await wait(ANIM.boardSlideDuration + ANIM.boardSlideDelay)
            if (token !== entryToken) return

            // winner message appears once the winner board is in position
            setCenterMessage([MSG_WINNER])
            showCenter()

            await wait(ANIM.fichesDelay)
            if (token !== entryToken) return

            // 3. winner fiches count up (doubled)
            await animateValue(bets[w], Store.players[w].bet, Store.players[w].bet * 2, ANIM.fichesDuration, 'assets/sounds/coin.mp3')
            if (token !== entryToken) return

            // 4. the message disappears, then the loser board slides in from the bottom
            hideCenter()
            await wait(ANIM.centerMessageDelay)
            if (token !== entryToken) return

            showBoard(boards[l])
            await wait(ANIM.boardSlideDuration + ANIM.boardSlideDelay)
            if (token !== entryToken) return

            // loser message appears once the loser board is in position
            setCenterMessage([MSG_LOSER])
            showCenter()

            await wait(ANIM.fichesDelay)
            if (token !== entryToken) return

            // 5. loser fiches count down to 0
            await animateValue(bets[l], Store.players[l].bet, 0, ANIM.fichesDuration, 'assets/sounds/grab-coin.mp3')
            if (token !== entryToken) return
        }

        // 6. end message appears
        await wait(ANIM.centerMessageDelay)
        if (token !== entryToken) return
        setCenterMessage([MSG_END])
        showCenter()

        // 7. reveal the restart buttons
        revealButtons()
    })()

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

    // cancel any pending timeouts and animation frames
    entryToken++
    pendingTimeouts.forEach(clearTimeout)
    pendingTimeouts = []
    pendingFrames.forEach(cancelAnimationFrame)
    pendingFrames = []

    // reset the boards and the central message for a clean re-entry
    boards.forEach(board => board.classList.add('is-offscreen'))
    centerMessage.classList.remove('is-visible')
    setCenterMessage([])

    btnRestartP1.classList.remove('disabled')
    btnRestartP2.classList.remove('disabled')
}
