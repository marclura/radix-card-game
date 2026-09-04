import Store from './Store.js'
import * as Characters from './../../../data/characters.js'

export function populateCharacters() {
    Store.charactersCount = Characters.CHARACTERS.length
    const listCharacters = document.querySelector('#list-thumbnails')
    const displaySelectionP1 = document.querySelector('#display-selection-p1')
    const displaySelectionP2 = document.querySelector('#display-selection-p2')

    // DOM fragments (invisible container that won't make the browser recalculate the layout)
    const thumbFrag = document.createDocumentFragment()
    const p1Frag = document.createDocumentFragment()
    const p2Frag = document.createDocumentFragment()

    Characters.CHARACTERS.forEach((el, index) => {

        // thumbnails
        const thumbnail = document.createElement('div')
        thumbnail.id = `character-thumbnail-${index}`
        const h3 = document.createElement('h3')
        h3.classList.add('character-name')
        h3.textContent = Characters.CHARACTERS[index].name
        thumbnail.append(h3)
        // thumbnail.style.backgroundColor = el.color
        thumbnail.classList.add('character-thumbnail')
        thumbFrag.append(thumbnail)

        const card = generateCharacterCard(index)
        const card2 = card.cloneNode(true)  // clone it for the 2nd player

        p1Frag.append(card)
        p2Frag.append(card2)

        

    });

    // append only one when the Fragments are ready with all the content
    listCharacters.append(thumbFrag)
    displaySelectionP1.append(p1Frag)
    displaySelectionP2.append(p2Frag)

}

// generate character card
export function generateCharacterCard(index) {
    const el = Characters.CHARACTERS[index]
    // character card
    const card = document.createElement('div')
    card.id = `character-card-${index}`
    card.classList.add('character-card')
    card.dataset.color = el.color
    const h3 = document.createElement('h3')
    h3.classList.add('character-name')
    h3.textContent = el.name    // character name
    card.append(h3)
    
    // character skills list
    const skillList = document.createElement('ul')
    skillList.classList.add('character-skill-list')

    Object.entries(el.skills).forEach(([skill, value]) => {
        const skillLi = document.createElement('li')
        //const skillBarContainer = document.createElement('div')
        const skillBar = document.createElement('div')
        const skillName = document.createElement('h4')


        // li
        skillLi.classList.add('skill-entry')
        skillLi.dataset.skill = skill

        // bar container
        //skillBarContainer.classList.add('skill-bar-container')
        //skillBarContainer.dataset.value = `${value * 100}`

        // bar
        skillBar.classList.add('skill-bar')
        //skillBar.textContent = `${value * 100}/100`
        skillBar.style.width = `${value * 100}%`

        // append bar to barContainer
        //skillBarContainer.append(skillBar)

        // name
        skillName.textContent = translateSkillKey(skill)
        skillName.classList.add('skill-name')

        // append to li
        skillLi.append(skillBar)
        skillLi.append(skillName)

        // append to ul
        skillList.append(skillLi)
    })

    card.append(skillList)

    return card
}


// translate key to ita
export function translateSkillKey(key) {
    const translations = {
        strength: 'forza',
        speed: 'velocità',
        discipline: 'disciplina',
        strategy: 'strategia',
        defense: 'difesa',
        luck: 'fortuna'
    };

    return translations[key] || key;
}

// second to minuts:seconds
export function formatSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// play audio file
const audioCache = new Map() // cache the audio, check if not already loaded

// browsers block Audio.play() until the user has interacted with the page
// (autoplay policy). Track the first interaction and skip sounds played
// before it instead of letting them fail with a NotAllowedError.
let audioUnlocked = false

function unlockAudio() {
    audioUnlocked = true
    document.removeEventListener('pointerdown', unlockAudio)
    document.removeEventListener('keydown', unlockAudio)
    document.removeEventListener('touchstart', unlockAudio)
}

document.addEventListener('pointerdown', unlockAudio, { once: true })
document.addEventListener('keydown', unlockAudio, { once: true })
document.addEventListener('touchstart', unlockAudio, { once: true })

export function playSound(filePath) {
    if (!audioUnlocked) return
    let audio = audioCache.get(filePath)    
    if (!audio) {
        audio = new Audio(filePath)
        audioCache.set(filePath, audio)
    }
    audio.currentTime = 0
    audio.play().catch(e => console.error("Audio error:", e));
}

// play audio file allowing rapid overlapping plays (e.g. count down/up ticks)
// clones the cached audio node so each tick plays independently instead of
// restarting (and cutting off) the previous one
export function playTickSound(filePath) {
    if (!audioUnlocked) return
    let audio = audioCache.get(filePath)
    if (!audio) {
        audio = new Audio(filePath)
        audioCache.set(filePath, audio)
    }
    const tick = audio.cloneNode()
    tick.play().catch(e => console.error("Audio error:", e));
}