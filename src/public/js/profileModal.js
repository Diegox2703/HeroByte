const profileModalContainer = document.querySelector('.profileModal-container')
const profileImgModal = document.querySelector('.profile-img-modal')
const closeProfileModal = document.querySelector('.close-profileModal')

export function openProfileModal(e) {
    const profileImg = e.target
    const profileImgURL = profileImg.getAttribute('src').split('/')[3]

    profileImgModal.src = `/uploads/profileImg/${profileImgURL}`

    profileModalContainer.style.display = 'flex'
    document.body.style.overflow = 'hidden'

    closeProfileModal.addEventListener('click', () => {
        profileModalContainer.style.display = 'none'
        document.body.style.overflow = 'auto'
    })
}