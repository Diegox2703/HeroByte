import { getCharacters } from './apiRequest.js'
import { loadCharacterModal } from './characterModal.js'

const characterCards = document.querySelectorAll('.character-card')

characterCards.forEach(characterCard => {
    const characterId = characterCard.dataset.id

    characterCard.addEventListener('click', async () => {
        const character = await getCharacters(characterId)
        loadCharacterModal(character) 
    }) 
})

