const descriptionField = document.querySelector('.input-field-description')
const children = descriptionField.children

if (descriptionField.innerHTML !== '') descriptionField.classList.add('change')

descriptionField.addEventListener('input', () => {
    descriptionField.classList.add('change') 
})

descriptionField.addEventListener('paste', function (event) {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text');
    
    const selection = window.getSelection()
    if (!selection.rangeCount) return
    
    selection.deleteFromDocument()
    selection.getRangeAt(0).insertNode(document.createTextNode(text))
});