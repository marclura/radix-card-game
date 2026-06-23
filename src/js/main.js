import { populateCharacters } from './core/Utils.js'
import Store, { resetStore } from './core/Store.js'
import * as Characters from './../../../data/characters.js'
import SceneManager from './core/SceneManager.js'

populateCharacters(Characters)

SceneManager.goToScene('welcome')
