import Store from './Store.js'

export function populateCharacters(Characters) {
    Store.charactersCount = Characters.CHARACTERS.length
    const listCharacters = document.querySelector('#list-thumbnails')
    const displaySelectionP1 = document.querySelector('#display-selection-p1')
    const displaySelectionP2 = document.querySelector('#display-selection-p2')

    Characters.CHARACTERS.forEach((el, index) => {

        // thumbnails
        const thumbnail = document.createElement('div')
        thumbnail.id = `character-thumbnail-${index}`
        thumbnail.textContent = el.name
        // thumbnail.style.backgroundColor = el.color
        thumbnail.classList.add('character-thumbnail')
        listCharacters.append(thumbnail)

        // character card
        const card = document.createElement('li')
        card.id = `character-card-${index}`
        card.classList.add('character-card')
        card.dataset.color = el.color
        const h3 = document.createElement('h3')
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
            skillName.textContent = skill
            skillName.classList.add('skill-name')

            // append to li
            skillLi.append(skillBar)
            skillLi.append(skillName)

            // append to ul
            skillList.append(skillLi)
        })

        card.append(skillList)

        // clone it for the 2nd player
        const card2 = card.cloneNode(true)

        displaySelectionP1.append(card)
        displaySelectionP2.append(card2)

    });
}