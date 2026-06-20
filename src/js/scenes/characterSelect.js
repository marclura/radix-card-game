import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'

let p1Ready = false
let p2Ready = false

const handlers = {  // list of event listeners
    confirmP1: null,
    confirmP2: null,
    nextP1: null,
    previousP1: null,
    nextP2: null,
    previousP2: null
}

const displaySelectionP1 = document.querySelector('#display-selection-p1')
const displaySelectionP2 = document.querySelector('#display-selection-p2')
const listCharacters = document.querySelector('#list-characters')

export const el = document.querySelector('#scene-character-select')

export function onEnter() {
    p1Ready = false
    p2Ready = false

    updateP1()
    updateP2()

    handlers.nextP1 = () => {
        if (Store.players[0].character < Store.charactersCount - 1) Store.players[0].character++
        else Store.players[0].character = 0
        updateP1()
    }

    handlers.previousP1 = () => {
        if (Store.players[0].character > 0) Store.players[0].character --
        else Store.players[0].character = Store.charactersCount - 1
        updateP1()
    }

    handlers.nextP2 = () => {
        if (Store.players[1].character < Store.charactersCount - 1) Store.players[1].character++
        else Store.players[1].character = 0
        updateP2()
    }

    handlers.previousP2 = () => {
        if (Store.players[1].character > 0) Store.players[1].character --
        else Store.players[1].character = Store.charactersCount - 1
        updateP2()
    }

    handlers.confirmP1 = () => {
        p1Ready = true
        if (p1Ready && p2Ready) {
            // save current player for P1 and P2
            EventBus.emit('scene:tutorial')
        }
    }
    handlers.confirmP2 = () => {
        p2Ready = true
        if (p1Ready && p2Ready) {
            // save current player for P1 and P2
            EventBus.emit('scene:tutorial')
        } 
    }

    // p1
    document.querySelector('#btn-select-next-p1').addEventListener('click', handlers.nextP1)
    document.querySelector('#btn-select-previous-p1').addEventListener('click', handlers.previousP1)
    document.querySelector('#btn-select-p1').addEventListener('click', handlers.confirmP1)

    //p2
    document.querySelector('#btn-select-next-p2').addEventListener('click', handlers.nextP2)
    document.querySelector('#btn-select-previous-p2').addEventListener('click', handlers.previousP2)
    document.querySelector('#btn-select-p2').addEventListener('click', handlers.confirmP2)
}

export function onExit() {
    document.querySelector('#btn-select-next-p1').removeEventListener('click', handlers.nextP1)
    document.querySelector('#btn-select-previous-p1').removeEventListener('click', handlers.previousP1)
    document.querySelector('#btn-select-p1').removeEventListener('click', handlers.confirmP1)

    document.querySelector('#btn-select-next-p2').removeEventListener('click', handlers.nextP2)
    document.querySelector('#btn-select-previous-p2').removeEventListener('click', handlers.previousP2)
    document.querySelector('#btn-select-p2').removeEventListener('click', handlers.confirmP2)
}

function updateP1() {

    // selection display
    [...displaySelectionP1.children].forEach(el => {
        el.classList.remove('active')
    });

    displaySelectionP1.children[Store.players[0].character].classList.add('active');


    // thumbnail list
    [...listCharacters.children].forEach(el => {
        el.classList.remove('p1-selection')
    });

    listCharacters.children[Store.players[0].character].classList.add('p1-selection');

    //console.log("Store.players[0].characterSelected: " + Store.players[0].characterSelected);

}

function updateP2() {

    // selection display
    [...displaySelectionP2.children].forEach(el => {
        el.classList.remove('active')
    });

    displaySelectionP2.children[Store.players[1].character].classList.add('active');

    // thumbnail list
    [...listCharacters.children].forEach(el => {
        el.classList.remove('p2-selection')
    });

    listCharacters.children[Store.players[1].character].classList.add('p2-selection');


    //console.log("Store.players[1].characterSelected: " + Store.players[1].characterSelected);

}