import { newIdFinder, zIndexFinder } from "../finders/num-finders"

export const newNoteGenerator = (stateObj) => {
    let newNote = { ...stateObj.newNote }
    let notes = [...stateObj.notes]
    let textarea = document.querySelector('.pad-frame')
    let inputText = document.querySelector('#input-text')

    // get style and content from note pad
    newNote.noteText = inputText.innerText
    newNote.id = newIdFinder(stateObj)
    newNote.width = getComputedStyle(textarea).getPropertyValue('width')
    newNote.height = getComputedStyle(textarea).getPropertyValue('height')
    newNote.left = `${Math.floor(Math.random() * 70)+180}px`
    newNote.top = `${Math.floor(Math.random() * 70)+270}px`
    newNote.zIndex = zIndexFinder(notes)
    inputText.innerText = ''
    notes.push(newNote)

    return notes
}
