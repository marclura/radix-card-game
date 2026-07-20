import { populateCharacters } from './core/Utils.js'
import Store, { resetStore } from './core/Store.js'
import SceneManager from './core/SceneManager.js'

populateCharacters()

// welcome, characterSelect, bet, gamePlay, winner

SceneManager.goToScene('welcome')


