import { uploadProfileImg } from './apiRequest.js'

const profileImg = document.querySelector('.profile-image')

if (profileImg) profileImg.addEventListener('change', uploadProfileImg)