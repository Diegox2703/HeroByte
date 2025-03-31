import { createCharacterCards } from './components.js'
import { openErrorModal } from './errorModal.js'

export const validateRegister = async (e) => {
    e.preventDefault()

    const { username, email, password, confirm_password } = e.target.elements

    try {
        const apiRespond = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
                confirm_password: confirm_password.value
            }),
            headers: {'Content-type': 'application/json'}
        })
        const resJson = await apiRespond.json()
        if (resJson.error) return document.querySelector('.error-msg').innerText = resJson.errorMessage
        window.location.href = resJson.redirect
    } catch(err) {
        console.log('Hubo un error con la API')
        console.log(err)
    }
}

export const validateLogin = async (e) => {
    e.preventDefault()

    const { username, password } = e.target.elements

    try {
        const apiRespond = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username.value,
                password: password.value
            }),
            headers: {'Content-type': 'application/json'}
        })
        const resJson = await apiRespond.json()
        if (resJson.error) return document.querySelector('.error-msg').innerText = resJson.errorMessage
        window.location.href = resJson.redirect
    } catch(err) {
        console.log(err)
    }
}

export const validateUsername = async (e) => {
    e.preventDefault()

    const { username } = e.target.elements

    try {
        const apiRespond = await fetch('/validate/username', {
            method: 'POST',
            body: JSON.stringify({username: username.value}),
            headers: {'Content-type': 'application/json'}
        })
        const resJson = await apiRespond.json()
        console.log(resJson)
        if (resJson.error) return document.querySelector('.error-msg').innerText = resJson.errorMessage
        window.location.href = resJson.redirect
    } catch(err) {
        console.log(err)
    }
}

export const closeSession = async (e) => {
    e.preventDefault()
    try {
        const apiRespond = await fetch('/logout', {
            method: 'POST',
            headers: {'Content-type': 'application/json'}
        })
        const resJson = await apiRespond.json()
        window.location.href = resJson.redirect
    } catch(err) {
        console.log(err)
    }
}

export const validateCharacter = async (e) => {
    e.preventDefault()

    let characterForm = e.target
    let characterId = characterForm.dataset.id
    let methodSelected = 'POST'
    let URL = '/new/character'

    const formData = new FormData(characterForm)
    const descriptionHTML = document.querySelector('.input-field-description').innerHTML
    const descriptionText = document.querySelector('.input-field-description').innerText
    formData.set('descriptionHTML', descriptionHTML)
    formData.set('description', descriptionText)

    if (characterId !== 'false') {
        let imgSelected = document.querySelector('.demo-image').dataset.oldimage
        let imgURl = imgSelected.split('/')[2]
        formData.set('image_selected', imgURl)

        methodSelected = 'PATCH'
        URL = `/update/${characterId}` 
    }

    const apiRespond = await fetch(URL, {
        method: methodSelected,
        body: formData,
    })

    const resJson = await apiRespond.json()
    if (resJson.error) {
        return document.querySelector('.error-msg').innerText = resJson.errorMessage
    }
    window.location.href = resJson.redirect

    characterForm.reset()
}

export const getCharacters = async (id) => {
    try {
        const apiRespond = await fetch(`/character/${id}`)
        const character = await apiRespond.json()

        return character
    } catch(err) {
        console.log(err)
    }
}

export const updateCharacter = async (id) => {
    try {
        const apiRespond = await fetch(`/update/${id}`, {
            method: 'PATCH',
            headers: {'content-type': 'application/json'}
        })

        const resJson = await apiRespond.json()
    } catch(err) {
        console.log(err)
    }
}

export const searchCharacters = async (characterName) => {
    console.log(characterName)
    try {
        const apiRespond = await fetch(`/search/character`, {
            method: 'POST',
            body: JSON.stringify({search: characterName}), 
            headers: {'content-type': 'application/json'}
        })
        const characters = await apiRespond.json()

        createCharacterCards(characters)
    } catch(err) {
        console.log(err)
    }
}

export const searchGame = async (gameName) => {
    try {
        const apiRespond = await fetch(`/search/${gameName}`)
        let games = apiRespond.ok ? await apiRespond.json() : undefined

        return games
    } catch(err) {
        console.log(err)
    }
}

export const uploadProfileImg = async (e) => {
    const userImg = document.querySelector('.user-image')
    const profileImg = e.target.files[0]
    const form = new FormData()
    console.log(profileImg) 

    form.set('profile-image', profileImg)

    try {
        const apiRequest = await fetch('/upload/image', {
            method: 'POST',
            body: form,
        })
        const resJson = await apiRequest.json()
        
        if (resJson.error) return openErrorModal(resJson.errorMessage)

        userImg.src = URL.createObjectURL(profileImg)
    } catch(err) {
        console.log(err)
    }
}

export const deleteCharacter = async (characterId, characterImg) => {
    try {
        const apiRespond = await fetch('/delete/character', {
            method: 'DELETE',
            body: JSON.stringify({characterId, characterImg}),
            headers: {'content-type': 'application/json'}
        })
        const resJson = await apiRespond.json()
        if (resJson.success) return true
    } catch(err) {
        console.log(err)
    }
}