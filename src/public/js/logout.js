import { closeSession } from './apiRequest.js'

const logoutBtn = document.querySelector('.logout-btn')

if (logoutBtn) logoutBtn.addEventListener('click', closeSession)
