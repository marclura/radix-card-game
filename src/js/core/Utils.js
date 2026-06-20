import Store from './Store.js'

export function populateCharacters(Characters) {
    Store.charactersCount = Characters.CHARACTERS.length
    const listCharacters = document.querySelector('#list-characters')
    const displaySelectionP1 = document.querySelector('#display-selection-p1')
    const displaySelectionP2 = document.querySelector('#display-selection-p2')

    Characters.CHARACTERS.forEach((el, index) => {

        // thumbnails
        const thumbnail = document.createElement('div')
        thumbnail.id = `character-thumbnail-${index}`
        thumbnail.textContent = el.name
        thumbnail.style.backgroundColor = el.color
        thumbnail.classList.add('character-thumbnail')
        listCharacters.append(thumbnail)

        // cards
        const card1 = document.createElement('li')
        card1.id = `character-card-${index}`
        card1.classList.add('character-card')
        card1.dataset.color = el.color
        const h3 = document.createElement('h3')
        h3.textContent = el.name
        card1.append(h3)
        

        const divLuck = document.createElement('div')
        const divDiscipline = document.createElement('div')
        const divSkills = document.createElement('div')

        divLuck.classList.add('character-bar')
        divDiscipline.classList.add('character-bar')
        divSkills.classList.add('character-bar')

        divLuck.style.width = `${el.luck * 100}%`
        divDiscipline.style.width = `${el.discipline * 100}%`
        divSkills.style.width = `${el.skills * 100}%`        

        card1.append(divLuck)
        card1.append(divDiscipline)
        card1.append(divSkills)

        const card2 = card1.cloneNode(true)

        displaySelectionP1.append(card1)
        displaySelectionP2.append(card2)

    });
}