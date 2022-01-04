export const dropHelper = (boardObj) => {

    let cont = document.createElement('div')
    let xButton = document.createElement('button')
    let button = document.createElement('button')
    xButton.type = 'button'
    xButton.innerHTML = 'X'
    xButton.classList.add('delete')
    button.type = 'button'
    button.innerHTML = boardObj.name
    cont.classList.add('button-cont')

    return [cont, button, xButton]
}