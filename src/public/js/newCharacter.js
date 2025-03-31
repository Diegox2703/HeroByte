import { validateCharacter } from "./apiRequest.js"

const characterForm = document.getElementById('create-character-form')

characterForm.addEventListener('submit', validateCharacter)