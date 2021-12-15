import { indexFinder } from '../finders/num-finders'

export const startUpdate = (id, notesObj) => {
  let newIndex = indexFinder(notesObj, id)
  let noteToUpdate = document.getElementById(`${id}`)
  let inputText = document.querySelector('#input-text')
  let opFrame = document.querySelector('.options-frame')
  let padFrame = document.querySelector('.pad-frame')

  // display cues
  noteToUpdate.classList.add('selected')
  opFrame.classList.add('selected')

  // send note data to compose area
  inputText.innerText = notesObj[newIndex].noteText
  padFrame.style.setProperty('width', notesObj[newIndex].width)
  padFrame.style.setProperty('height', notesObj[newIndex].height)
}

export const updateNote = (id, notesObj) => {
    let inputText = document.querySelector('#input-text')
    let padFrame = document.querySelector('.pad-frame')
    let newIndex = indexFinder(notesObj, id)
    let upNote = { ...notesObj[newIndex] }

    // get dimensions and content from selected note
    upNote.noteText = inputText.innerText
    upNote.width = getComputedStyle(padFrame).getPropertyValue('width')
    upNote.height = getComputedStyle(padFrame).getPropertyValue('height')
    upNote.id = id
    notesObj[newIndex] = upNote
    inputText.innerText = ''

    return notesObj
}