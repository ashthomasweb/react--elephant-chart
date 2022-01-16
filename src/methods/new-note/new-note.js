import { newIdFinder, zIndexFinder, zIndexFinderMat } from "../finders/num-finders"

export const newNoteGenerator = (stateObj, isMat=false) => {
    let newNote = { ...stateObj.newNote }
    let notes = [...stateObj.notes]
    let padFrame = document.querySelector('.pad-frame')
    let inputText = document.querySelector('#input-text')

    // get style and content from note pad
    newNote.id = newIdFinder(stateObj)
    newNote.width = getComputedStyle(padFrame).getPropertyValue('width')
    newNote.height = getComputedStyle(padFrame).getPropertyValue('height')




    newNote.left = `${Math.floor(Math.random() * 60)+100}px`
    newNote.top = `${Math.floor(Math.random() * 60)+160}px`





    
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

