const errorModalContainer = document.querySelector('.errorModal-container')
const errorMsgModal = document.querySelector('.error-msg-modal')
const errorModal = document.querySelector('.errorModal')
const okBtn = document.querySelector('.ok-btn')

export function openErrorModal(message) {
    errorModalContainer.style.display = 'flex'
    errorModalContainer.style.animation = 'fadeIn .5s forwards'
    errorModal.style.animation = 'slidedown .5s forwards'
    errorMsgModal.innerText = message
     document.body.style.overflow = 'hidden'

    okBtn.addEventListener('click', () => {
        let timeout = setTimeout(() => {
            errorModalContainer.style.display = 'none'
            clearTimeout(timeout)
        }, 500)
        document.body.style.overflow = 'auto'
        errorModalContainer.style.animation = 'fadeOut .5s forwards'
        errorModal.style.animation = 'slideup .5s forwards'
    })
}