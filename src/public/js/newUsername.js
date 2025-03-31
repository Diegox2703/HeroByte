import { validateUsername } from './apiRequest.js'

const newUsernameform = document.getElementById('newUsername-form')

newUsernameform.addEventListener('submit', validateUsername)