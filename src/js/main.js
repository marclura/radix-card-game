import { populateCharacters } from './core/Utils.js'
import Store, { resetStore } from './core/Store.js'
import SceneManager from './core/SceneManager.js'

populateCharacters()

// welcome, characterSelect, bet, gamePlay, winner

SceneManager.goToScene('welcome')



// Create audio object
const soundtrack = new Audio('./../../assets/sounds/soundtrack.mp3')
soundtrack.loop = true
soundtrack.play().catch(e => console.error("Audio play failed:", e))

