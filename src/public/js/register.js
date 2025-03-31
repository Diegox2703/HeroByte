import { validateRegister } from './apiRequest.js'

const registerForm = document.getElementById('register-form')

registerForm.addEventListener('submit', validateRegister)

