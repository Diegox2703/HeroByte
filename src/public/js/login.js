import { validateLogin } from './apiRequest.js'

const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', validateLogin)