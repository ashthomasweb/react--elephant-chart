import React, { Component } from 'react'

// import logo from '../../assets/flow-post-logo.png'
import blank from '../../assets/trimmed-noborder.png'

import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'

import './directory.styles.scss'

class Directory extends Component {
  constructor() {
    super()

    this.state = {
      currentDrag: {},
      notes: [
        {
          id: 1,
          top: '',
          left: '',
          imageUrl: blank,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText: 'We can write notes! Write here! Right?'
        },
      ],
    }

    this.dave = this.tester.bind(this)
  }

  tester = (input) => {
    this.setState({ currentDrag: input })
    var newNote = { ...this.state.currentDrag }
    var newIndex = newNote.id - 1
    var notes = [...this.state.notes]
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  dropHandler = (e) => {
    this.tester()
    // database storage for board persistence
  }

  newNoteGenerator = () => {
    var newNote = {...this.state.notes[0]}
    var notes = [...this.state.notes]
    newNote.noteText = document.querySelector('#input-text').value
    newNote.id = this.state.notes.length + 1
    let left = parseFloat(getComputedStyle(document.querySelector('.compose-frame')).getPropertyValue('left')) - 240 + 'px'
    let top = parseFloat(getComputedStyle(document.querySelector('.compose-frame')).getPropertyValue('top')) - 120 + 'px'
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
          <NoteItem key={id} dave={this.tester} value={id} {...sectionProps} />
        ))}
        <CustomButton
          style={{ top: '0px', left: '770px', position: 'absolute' }}
          onClick={() => console.log(this.state)}>
          Log Notes State
        </CustomButton>
        <CustomButton
          style={{ top: '0px', left: '500px', position: 'absolute' }}
          onClick={() => console.log(this.state.currentDrag)}>
          Log CurrentDrag State
        </CustomButton>
        <div className='compose-frame'>
          <textarea id='input-text' type='text' placeholder='New Note Text'></textarea>
          <button type='button' onClick={this.newNoteGenerator}>Place on Board</button>
        </div>
      </div>
    )
  }
}

export default Directory
