import { getCharacters, searchGame } from './apiRequest.js'
import { loadCharacterModal } from './characterModal.js'

export function createCharacterCards(characters) {
    document.querySelector('.characters-container').innerHTML = ''
    characters.forEach(character => { 
        let characterCard = document.createElement('article')
        characterCard.classList.add('character-card')
        characterCard.dataset.id = character.character_id

        characterCard.innerHTML = `
                <section class="character-image-section">
                    <img class="character-image" src="/uploads/characterImg/${character.character_img}" alt="character-image">
                </section>
                <section class="character-name-section">
                    <h2 class="character-name">${character.character_name}</h2>
                </section> 
        `
        characterCard.addEventListener('click', async () => {
            const character = await getCharacters(characterCard.dataset.id)
            loadCharacterModal(character)
        })
        document.querySelector('.characters-container').appendChild(characterCard)
    })
}

export async function createGameResult (e, game) {
    document.querySelector('.game-dropdown-menu').innerHTML = ''
    const gameInput = e.target
    const games = await searchGame(game)

    if (games) {
        return games.forEach(game => {
            let gameResult = document.createElement('li')
            gameResult.classList.add('dropdown-menu-opt')
            gameResult.innerText = game.game_name
            gameResult.addEventListener('click', () => {
                gameInput.value = gameResult.innerText
                document.querySelector('.game-dropdown-menu').style.visibility = 'hidden';
            })
    
            document.querySelector('.game-dropdown-menu').appendChild(gameResult)
            document.querySelector('.game-dropdown-menu').style.visibility = 'visible';
        })
    }

    document.querySelector('.game-dropdown-menu').style.visibility = 'hidden';
}