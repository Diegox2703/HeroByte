import { updateCharacter } from './apiRequest.js'

const updateBtn = document.querySelector('.update-btn')
const characterModalId = document.getElementById('characterModal').dataset.id

if (updateBtn) updateBtn.addEventListener('click', () => updateCharacter(characterModalId))