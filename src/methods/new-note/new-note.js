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
    newNote.left = `${Math.floor(Math.random() * 70)+180}px`
    newNote.top = `${Math.floor(Math.random() * 70)+270}px`
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
