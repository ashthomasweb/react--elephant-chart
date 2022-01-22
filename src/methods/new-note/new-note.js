import { newIdFinder, zIndexFinder, zIndexFinderMat } from "../finders/num-finders"

export const newNoteGenerator = (stateObj, isMat=false, isEmbed) => {
    let newNote = { ...stateObj.newNote }
    let notes = [...stateObj.notes]
    let padFrame = document.querySelector('.pad-frame')
    let inputText = document.querySelector('#input-text')

    newNote.id = newIdFinder(stateObj)
    newNote.width = getComputedStyle(padFrame).getPropertyValue('width')
    newNote.height = getComputedStyle(padFrame).getPropertyValue('height')

    // note placement
    let uiZoom = document.querySelector('.pad-frame').style.zoom
    let padEdge = document.querySelector('.pad-frame').getBoundingClientRect().left
    let padWidth = getComputedStyle(document.querySelector('#input-text')).getPropertyValue('width')
    let boardHangX = document.querySelector('.board-backing').scrollLeft
    uiZoom = uiZoom.replace(/calc\(/g, '')
    uiZoom = uiZoom.replace(/\)/g, '')
    uiZoom = uiZoom.replace(/%/g, '')
    uiZoom = parseFloat(uiZoom) / 100
    let numX = ((padEdge) + parseFloat(padWidth)) * uiZoom
    let headerHeight = getComputedStyle(document.querySelector('.header')).getPropertyValue('height')
    let boardHangY = document.querySelector('.board-backing').scrollTop
    let numY = (parseFloat(headerHeight) * uiZoom) + boardHangY
    newNote.left = `${numX + boardHangX}px`
    newNote.top = `${numY}px`

    // embed
    if (isEmbed) {
      newNote.iframe = `https://protected-temple-05511.herokuapp.com/${inputText.innerText}`
      newNote.isTrayDisplay = true
    }

    newNote.noteText = inputText.innerText
    inputText.innerText = ''
    if (isMat) {
        newNote.isMatBoard = true
        newNote.zIndex = zIndexFinderMat(notes)
    } else {
        newNote.zIndex = zIndexFinder(notes)
    }
    notes.push(newNote)

    return notes
}

export const rgbToHex = (rgb) => {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
    if (r.length === 1)
      r = "0" + r;
    if (g.length === 1)
      g = "0" + g;
    if (b.length === 1)
      b = "0" + b;
    return "#" + r + g + b;
}
