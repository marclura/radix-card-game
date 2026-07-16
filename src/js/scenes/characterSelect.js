import EventBus from '../core/EventBus.js'
import Store from '../core/Store.js'
import * as Characters from '../../../data/characters.js'

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
const listCharacters = document.querySelector('#list-thumbnails')

export const el = document.querySelector('#scene-character-select')

export function onEnter() {
    p1Ready = false
    p2Ready = false

    updateP1()
    updateP2()

    handlers.nextP1 = () => {
        if(!p1Ready) {
            if (Store.players[0].character < Store.charactersCount - 1) Store.players[0].character++
            else Store.players[0].character = 0
            updateP1()
        }
    }

    handlers.previousP1 = () => {
        if(!p1Ready) {
            if (Store.players[0].character > 0) Store.players[0].character--
            else Store.players[0].character = Store.charactersCount - 1
            updateP1()
        }
    }

    handlers.nextP2 = () => {
        if(!p2Ready) {
            if (Store.players[1].character < Store.charactersCount - 1) Store.players[1].character++
            else Store.players[1].character = 0
            updateP2()
        }
    }

    handlers.previousP2 = () => {
        if(!p2Ready) {
            if (Store.players[1].character > 0) Store.players[1].character--
            else Store.players[1].character = Store.charactersCount - 1
            updateP2()
        }
    }

    handlers.confirmP1 = () => {
        p1Ready = true;

        Store.players[0].skills = Characters.CHARACTERS[Store.players[0].character].skills;

        Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p1').children, el => {
            el.classList.add('disabled')
        })

        if (p1Ready && p2Ready) {
            // save current player for P1 and P2
            EventBus.emit('scene:bet')
        }
    }
    handlers.confirmP2 = () => {
        p2Ready = true;

        Store.players[1].skills = Characters.CHARACTERS[Store.players[1].character].skills;

        Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p2').children, el => {
            el.classList.add('disabled')
        })

        if (p1Ready && p2Ready) {
            // save current player for P1 and P2
            EventBus.emit('scene:bet')
        } 
    }

    // p1
    document.querySelector('#scene-character-select .btn-A-p1').addEventListener('click', handlers.previousP1)
    document.querySelector('#scene-character-select .btn-B-p1').addEventListener('click', handlers.nextP1)
    document.querySelector('#scene-character-select .btn-select-p1').addEventListener('click', handlers.confirmP1)

    //p2
    document.querySelector('#scene-character-select .btn-A-p2').addEventListener('click', handlers.previousP2)
    document.querySelector('#scene-character-select .btn-B-p2').addEventListener('click', handlers.nextP2)
    document.querySelector('#scene-character-select .btn-select-p2').addEventListener('click', handlers.confirmP2)
}

export function onExit() {
    // p1
    document.querySelector('#scene-character-select .btn-A-p1').removeEventListener('click', handlers.previousP1)
    document.querySelector('#scene-character-select .btn-B-p1').removeEventListener('click', handlers.nextP1)
    document.querySelector('#scene-character-select .btn-select-p1').removeEventListener('click', handlers.confirmP1)

    //p2
    document.querySelector('#scene-character-select .btn-A-p2').removeEventListener('click', handlers.previousP2)
    document.querySelector('#scene-character-select .btn-B-p2').removeEventListener('click', handlers.nextP2)
    document.querySelector('#scene-character-select .btn-select-p2').removeEventListener('click', handlers.confirmP2);

    Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p1').children, el => {
        el.classList.remove('disabled')
    });

    Array.prototype.forEach.call(document.querySelector('#character-selector-controller-p2').children, el => {
        el.classList.remove('disabled')
    });
}

function updateP1() {

    // selection display
    Array.prototype.forEach.call(displaySelectionP1.children, el => {
        el.classList.remove('active')
    });

    displaySelectionP1.children[Store.players[0].character].classList.add('active');


    // thumbnail list
    Array.prototype.forEach.call(listCharacters.children, el => {
        el.classList.remove('p1-selection')
    });

    listCharacters.children[Store.players[0].character].classList.add('p1-selection');

    //console.log("Store.players[0].characterSelected: " + Store.players[0].characterSelected);

}

function updateP2() {

    // selection display
    Array.prototype.forEach.call(displaySelectionP2.children, el => {
        el.classList.remove('active')
    });

    displaySelectionP2.children[Store.players[1].character].classList.add('active');

    // thumbnail list
    Array.prototype.forEach.call(listCharacters.children, el => {
        el.classList.remove('p2-selection')
    });

    listCharacters.children[Store.players[1].character].classList.add('p2-selection');


    //console.log("Store.players[1].characterSelected: " + Store.players[1].characterSelected);

}