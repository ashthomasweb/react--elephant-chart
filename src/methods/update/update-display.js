import { indexFinder } from '../finders/num-finders'

export const startUpdate = (id, notesObj) => {
  let newIndex = indexFinder(notesObj, id)
  let noteToUpdate = document.getElementById(`${id}`)
  let inputText = document.querySelector('#input-text')
  let upFrame = document.querySelector('.update-frame')
  let padFrame = document.querySelector('.pad-frame')
  let noteColorPick = document.querySelector('#note-color-pick')

  // display cues
  noteToUpdate.classList.add('selected')
  upFrame.classList.add('selected')

  // send note data to compose area
  inputText.innerText = notesObj[newIndex].noteText
  if (notesObj[newIndex].noteBColor === undefined) {
    noteColorPick.value = '#f2ecb3'
    padFrame.style.setProperty('background-color', '#f2ecb3')
  } else {
    noteColorPick.value = notesObj[newIndex].noteBColor
    padFrame.style.setProperty('background-color', notesObj[newIndex].noteBColor)
  }
  padFrame.style.setProperty('width', notesObj[newIndex].width)
  padFrame.style.setProperty('height', notesObj[newIndex].height)
}

export const updateNote = (id, notesObj) => {
    let inputText = document.querySelector('#input-text')
    let padFrame = document.querySelector('.pad-frame')
    let noteColor = document.querySelector('#note-color-pick')
    let newIndex = indexFinder(notesObj, id)
    let upNote = { ...notesObj[newIndex] }

    // get dimensions and content from selected note
    upNote.noteText = inputText.innerText
    upNote.noteBColor = noteColor.value
    upNote.width = getComputedStyle(padFrame).getPropertyValue('width')
    upNote.height = getComputedStyle(padFrame).getPropertyValue('height')
    upNote.id = id
    notesObj[newIndex] = upNote
    inputText.innerText = ''

    return notesObj
}

export const cancelUpdate = (reset, id, prevNote) => {
  let padFrame = document.querySelector('.pad-frame')
  let noteColorPicker = document.querySelector('#note-color-pick')
  let inputText = document.querySelector('#input-text')
  if (reset === true) {
    padFrame.style.setProperty('background-color', prevNote.color)
    padFrame.style.setProperty('height', prevNote.height)
    padFrame.style.setProperty('width', prevNote.width)
    noteColorPicker.value = prevNote.color
    inputText.innerHTML = ''
  }
  if (document.getElementById(`${id}`)) {
    document.getElementById(`${id}`).classList.remove('selected')
    document.querySelector('.update-frame').classList.remove('selected')
  }
}