import { createGameResult } from './components.js'

const gameInput = document.getElementById('game-input')

gameInput.addEventListener('input', (e) => createGameResult(e, gameInput.value))