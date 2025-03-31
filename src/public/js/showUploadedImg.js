const inputFile = document.getElementById('input-file')
const demoImg = document.querySelector('.demo-image')
const inputFileContainer = document.querySelector('.upload-image-btn-container')

if (demoImg.getAttribute('src') !== '') {
    demoImg.style.display = 'block'
    inputFileContainer.style.display = 'none'
}

function showUploadedImg(e) {
    const imgData = e.target.files[0]
    const imgURL = URL.createObjectURL(imgData)

    if (imgData.type.startsWith('image/')) {
        demoImg.style.display = 'block'
        demoImg.src = imgURL
        inputFileContainer.style.display = 'none'
    }
}

inputFile.addEventListener('change', showUploadedImg)