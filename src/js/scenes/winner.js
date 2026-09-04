import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Characters from './../../../data/characters.js'
import { generateCharacterCard, playSound, playTickSound } from './../core/Utils.js'

// ===== animation parameters (tweak here) =====
const ANIM = {
    scoreDelay: 1000,       // ms - pause before the score count up starts
    scoreDuration: 1500,    // ms - score count up duration
    fichesDelay: 1000,      // ms - pause after the score, before the fiches animation
    fichesDuration: 1500,   // ms - fiches count up/down duration
    fichesGap: 1000,        // ms - pause between the loser count down and the winner count up
}

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

const characterP1 = document.querySelector('#scene-winner #winner-character-p1')
const characterP2 = document.querySelector('#scene-winner #winner-character-p2')

const finalScoreP1 = document.querySelector('#scene-winner #final-score-p1')
const finalScoreP2 = document.querySelector('#scene-winner #final-score-p2')

const betP1 = document.querySelector('#scene-winner #winner-bet-p1')
const betP2 = document.querySelector('#scene-winner #winner-bet-p2')

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

    // play the winner sound at the beginning of the scene
    playSound("assets/sounds/winner.mp3")

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

    // initial values
    finalScoreP1.textContent = 0
    finalScoreP2.textContent = 0
    betP1.textContent = p1.bet
    betP2.textContent = p2.bet

    // ===== animation sequence =====
    // 1. pause -> 2. score count up -> 3. pause -> 4. fiches count up/down -> 5. reveal buttons
    ;(async () => {
        // 1. pause before the score count up
        await wait(ANIM.scoreDelay)
        if (token !== entryToken) return

        // 2. score count up (both players in parallel)
        await Promise.all([
            animateValue(finalScoreP1, 0, p1.score, ANIM.scoreDuration),
            animateValue(finalScoreP2, 0, p2.score, ANIM.scoreDuration),
        ])
        if (token !== entryToken) return

        // 3. pause after the score, before the fiches animation
        await wait(ANIM.fichesDelay)
        if (token !== entryToken) return

        // 4. fiches: loser drops to 0 first, then after a pause the winner doubles (tie: no animation)
        if (winner === 0) {
            // winner (p1) count up
            await animateValue(betP1, p1.bet, p1.bet * 2, ANIM.fichesDuration, 'assets/sounds/coin.mp3')
            
            // pause between the loser count down and the winner count up
            await wait(ANIM.fichesGap)
            if (token !== entryToken) return

            // loser (p2) count down
            await animateValue(betP2, p2.bet, 0, ANIM.fichesDuration, 'assets/sounds/grab-coin.mp3')
            if (token !== entryToken) return

        } else if (winner === 1) {
            // winner (p2) count up
            await animateValue(betP2, p2.bet, p2.bet * 2, ANIM.fichesDuration, 'assets/sounds/coin.mp3')

            // pause between the loser count down and the winner count up
            await wait(ANIM.fichesGap)
            if (token !== entryToken) return

            // loser (p1) count down
            await animateValue(betP1, p1.bet, 0, ANIM.fichesDuration, 'assets/sounds/grab-coin.mp3')
            if (token !== entryToken) return            
        }
        if (token !== entryToken) return

        // 5. reveal the restart buttons
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

    btnRestartP1.classList.remove('disabled')
    btnRestartP2.classList.remove('disabled')
}
