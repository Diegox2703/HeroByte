import { deleteCharacter } from './apiRequest.js'

const deleteModalContainer = document.querySelector('.deleteModal-container')
const deleteModal = document.querySelector('.deleteModal')
const deleteBtn = document.querySelector('.delete-btn')
const cancelBtn = document.querySelector('.cancel-btn')
const confirmBtn = document.querySelector('.confirm-btn')

function openDeleteModal() {
    deleteModalContainer.style.display = 'flex'
    deleteModalContainer.style.animation = 'fadeIn .5s forwards'
    deleteModal.style.animation = 'slidedown .5s forwards'
}

function closeDeleteModal() {
    let timeout = setTimeout(() => {
        deleteModalContainer.style.display = 'none'
        clearTimeout(timeout)
    }, 500)
    deleteModalContainer.style.animation = 'fadeOut .5s forwards'
    deleteModal.style.animation = 'slideup .5s forwards'
}

async function deleteCharacterCard() {
    const characterId = document.getElementById('characterModal').dataset.modalId
    const characterImg = document.querySelector('.character-image-modal').getAttribute('src').split('/')[3]

    const isDeleted = await deleteCharacter(characterId, characterImg)

    if (isDeleted) {
        const characterModalContainer = document.querySelector('.characterModal-container')
        const charactersContainer = document.querySelector('.characters-container')
        const characterCard = document.querySelector(`[data-id="${characterId}"]`)

        charactersContainer.removeChild(characterCard)

        let timeout = setTimeout(() => {
            deleteModalContainer.style.display = 'none'
            characterModalContainer.style.display = 'none'
            clearTimeout(timeout)
        }, 500)
        
        document.body.style.overflow = 'auto'
        deleteModalContainer.style.animation = 'fadeOut .5s forwards'
        characterModalContainer.style.animation = 'fadeOut .5s forwards'
    }
}

confirmBtn.addEventListener('click', () => deleteCharacterCard())
cancelBtn.addEventListener('click', closeDeleteModal)
if (deleteBtn) deleteBtn.addEventListener('click', openDeleteModal)