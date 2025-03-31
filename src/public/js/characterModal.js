const characterModalCon = document.querySelector('.characterModal-container')
const closeModal = document.querySelector('.closeModal-btn')
const editModal = document.querySelector('.editModal-btn')
const updateBtn = document.querySelector('.update-btn')
const characterModal = document.getElementById('characterModal')

function openCharacterModal() {
    characterModalCon.style.display = 'flex'
    characterModalCon.style.animation = 'fadeIn .5s forwards'
    characterModal.style.animation = 'slidedown .5s forwards'
    document.body.style.overflow = 'hidden'
} 
 
function closeCharacterModal() {
    let timeout = setTimeout(() => {
        characterModalCon.style.display = 'none'
        clearTimeout(timeout)
    }, 500)
    characterModalCon.style.animation = 'fadeOut .5s forwards'
    characterModal.style.animation = 'slideup .5s forwards'
    document.body.style.overflow = 'auto'
}

export function loadCharacterModal(character) {
    const { character_img, character_name, creator, description, game_name, username} = character

    const characterImgModal = document.querySelector('.character-image-modal')
    const uploader = document.querySelector('.uploader')
    const characterNameModal = document.querySelector('.character-name-modal')
    const descriptionModal = document.querySelector('.description')
    const creatorModal = document.querySelector('.creator')
    const gameModal = document.querySelector('.game')

    characterImgModal.src = `/uploads/characterImg/${character_img}`
    uploader.innerText = username
    uploader.href = `/profile/${username}`
    characterNameModal.innerText = character_name
    descriptionModal.innerHTML = description
    creatorModal.innerText = creator
    gameModal.href = `/characters?game=${game_name}`
    gameModal.innerText = game_name
    characterModal.dataset.modalId = character.character_id

    if (editModal) {
        updateBtn.href = `/update/${character.character_id}`
    } 
    
    openCharacterModal()
    closeModal.addEventListener('click', closeCharacterModal)
}