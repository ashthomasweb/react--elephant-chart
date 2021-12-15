import { newIdFinder } from "../finders/num-finders"

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
    newNote.left = `${parseFloat(getComputedStyle(textarea).getPropertyValue('left'))-Math.floor(Math.random() * 70)-440}px`
    newNote.top = `${parseFloat(getComputedStyle(textarea).getPropertyValue('top'))+Math.floor(Math.random() * 70)+240}px`
    inputText.innerText = ''
    notes.push(newNote)

    return notes
}
