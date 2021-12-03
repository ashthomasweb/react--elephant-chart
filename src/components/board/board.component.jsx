import React, { Component } from 'react'

import blank from '../../assets/trimmed-noborder.png'
import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'

import './board.styles.scss'

class Board extends Component {
  constructor() {
    super()

    this.state = {
      currentDrag: {},
      notes: [
        {
          id: 1,
          width: '',
          height: '',
          top: '145px',
          left: '3px',
          zIndex: 0,
          imageUrl: blank,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText: 'We can write notes! Write here! Right?'
        },
      ],
    }

    this.dave = this.tester.bind(this)
    this.hal = this.resize.bind(this)
  }

  tester = (input) => {
    this.setState({ currentDrag: input })
    let newNote = { ...this.state.currentDrag }
    let newIndex = 0
    if (newNote.id !== 1) {
      newIndex = newNote.id - 1
    }
    let notes = [...this.state.notes]
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  resize = (input) => {
    this.setState({ currentDrag: input })
    let newNote = { ...this.state.currentDrag }
    let notes = [...this.state.notes]
    let newIndex = 0
    if (newNote.id !== 1) {
      newIndex = newNote.id - 1
    }
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  zIndexHandler = (e) => {
    let notes = [...this.state.notes]
    notes.forEach(note => {
      if (note.id !== Number(e.target.id)) {
        note.zIndex = note.zIndex - 1
      } else {
        note.zIndex = 1
      }
    });
    this.setState({ notes })
  }

  dropHandler = (e) => {
    this.tester()
    // database storage for board persistence
  }

  newNoteGenerator = () => {
    console.log('hi')
    let newNote = {...this.state.notes[0]}
    let notes = [...this.state.notes]
    newNote.noteText = document.querySelector('#input-text').value
    newNote.id = this.state.notes.length + 1
    let left = parseFloat(getComputedStyle(document.querySelector('.pad-frame')).getPropertyValue('left')) + 340 + 'px'
    let top = parseFloat(getComputedStyle(document.querySelector('.pad-frame')).getPropertyValue('top')) + 320 + 'px'
    newNote.left = left
    newNote.top = top
    notes.push(newNote)
    this.setState({ notes })
  }

  render() {
    return (
      <div
        className='directory-menu'
        onDragOver={(e) => e.preventDefault()}
        onDrop={this.dropHandler}>
        {this.state.notes.map(({ id, ...sectionProps }) => (
          <NoteItem key={id} dave={this.tester} hal={this.resize} stack={this.zIndexHandler} value={id} {...sectionProps} />
        ))}
        <CustomButton
          style={{ bottom: '0px', left: '0px', position: 'absolute' }}
          onClick={() => console.log(this.state)}>
          Log Notes State
        </CustomButton>
        {/* <CustomButton
          style={{ bottom: '0px', left: '0px', position: 'absolute' }}
          onClick={() => console.log(this.state.currentDrag)}>
          Log CurrentDrag State
        </CustomButton> */}
        <div className='options-frame'>
          <button className='options-btn' type='button' onClick={this.newNoteGenerator}>Place on Board</button>
          <button className='options-btn' type='button' onClick={this.newNoteGenerator} disabled>Placeholder</button>
          <button className='options-btn' type='button' onClick={this.newNoteGenerator} disabled>Placeholder</button>
          <button className='options-btn' type='button' onClick={this.newNoteGenerator} disabled>Placeholder</button>
        </div>
        <div className='pad-frame'>
          <textarea id='input-text' type='text' placeholder='New Note Text'></textarea>
        </div>
      </div>
    )
  }
}

export default Board
