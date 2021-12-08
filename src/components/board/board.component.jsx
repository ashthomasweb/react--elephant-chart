import React, { Component } from 'react'

import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'

import blankYellow from '../../assets/trimmed-noborder.png'

import {
  saveUserBoard,
  userBoards,
} from '../../firebase/firebase.utils'

import './board.styles.scss'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentDrag: {},
      newNote: {
        id: 0,
        width: '200px',
        height: '130px',
        top: '145px',
        left: '3px',
        zIndex: 0,
        imageUrl: blankYellow,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        noteText: '',
      },
      boardObj: {
        name: '',
        notes: [],
      },
      notes: [
        {
          id: 1,
          width: '',
          height: '',
          top: '145px',
          left: '3px',
          zIndex: 0,
          imageUrl: blankYellow,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText: 'We can write notes! Right here!',
        },
      ],
    }

    // not needed, anymore or ever?
    // this.dave = this.tester.bind(this)
    // this.hal = this.resize.bind(this)
  }

  tester = (input) => {
    this.setState({ currentDrag: input })
    let newNote = { ...this.state.currentDrag }
    let newIndex = 0
    let notes = [...this.state.notes]
    if (newNote.id !== 1) {
      newIndex = newNote.id - 1
    }
    notes[newIndex] = newNote
    notes[newIndex].zIndex = this.zIndexFinder()
    this.setState({ notes })
  }

  resize = (input) => {
    this.setState({ currentDrag: input })
    let newNote = { ...this.state.currentDrag }
    let notes = [...this.state.notes]
    let newIndex = newNote.id - 1
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  zIndexFinder = (e) => {
    let zList = []
    this.state.notes.forEach((note) => {
      zList.push(note.zIndex)
    })
    // NEED conditional to reset index if too large...outlying case, but would stop the stacking ability if maxed.
    return Math.max.apply(null, zList) + 1
  }

  dropHandler = (e) => {
    this.tester()
  }

  newNoteGenerator = () => {
    let newNote = { ...this.state.newNote }
    let notes = [...this.state.notes]
    newNote.noteText = document.querySelector('#input-text').value
    newNote.id = this.state.notes.length + 1 // may need refactor in future when note deletion is implemented!!
    let left =
      parseFloat(
        getComputedStyle(document.querySelector('.pad-frame')).getPropertyValue(
          'left'
        )
      ) -
      340 +
      'px'
    let top =
      parseFloat(
        getComputedStyle(document.querySelector('.pad-frame')).getPropertyValue(
          'top'
        )
      ) +
      120 +
      'px'
    newNote.left = left
    newNote.top = top
    notes.push(newNote)
    this.setState({ notes })
  }

  saveCurrentBoard = () => {
    console.log('hi dave')
    let boardObj = {
      name: document.querySelector('.save-board-input').value,
      notes: [...this.state.notes],
    }
    this.setState({ boardObj }, () => {
      this.saveBoardDatabase(this.state.boardObj)
    })
  }

  saveBoardDatabase = (boardObj) => {
    if (this.props.currentUser === null) {
      // localhost
      console.log('no user')
    } else {
      saveUserBoard(this.props.currentUser.auth, boardObj)
    }
  }

  displayUserBoards = () => {
    this.putBoardsToList()
    console.log('3', userBoards)
    console.log('hi hal')
    let elDisplay = document.querySelector('.board-drop').style
    elDisplay.display === 'block' ? elDisplay.display = 'none' : elDisplay.display = 'block'
  }

  putBoardsToList = () => {
    let newDiv = document.createElement('div')
    userBoards.forEach((board) => {
      let button = document.createElement('button')
      button.type = 'button'
      button.innerHTML = board.name
      button.addEventListener('click', () => {
        let notes = [...board.notes]
        this.setState({ notes })
      })
      newDiv.appendChild(button)
    })
    document.querySelector('.board-drop').appendChild(newDiv)
  }
 
  render() {
    return (
      <div className='board-backing' onDrop={this.dropHandler}>
        {this.state.notes.map(({ id, ...noteProps }) => (
          <NoteItem
            key={id}
            dave={this.tester}
            hal={this.resize}
            zHigh={this.zIndexFinder}
            value={id}
            {...noteProps}
          />
        ))}
        <div className='options-frame'>
          <button
            className='options-btn'
            type='button'
            onClick={this.newNoteGenerator}>
            Place on Board
          </button>
          <button
            className='options-btn'
            type='button'
            onClick={this.newNoteGenerator}
            disabled>
            Placeholder
          </button>
          <button
            className='options-btn'
            type='button'
            onClick={this.newNoteGenerator}
            disabled>
            Placeholder
          </button>
          <button
            className='options-btn'
            type='button'
            onClick={this.newNoteGenerator}
            disabled>
            Placeholder
          </button>
          <div className='database-options'>
            <h3>Save Boards</h3>
            <input
              type='text'
              className='save-board-input'
              placeholder='Enter Board Name'
            />
            <button type='button' onClick={() => this.saveCurrentBoard()}>
              Save
            </button>
            <button type='button' onClick={() => this.displayUserBoards()}>
              Your Boards
            </button>
            <div className='board-drop'>
            </div>
          </div>
        </div>
        <div className='pad-frame'>
          <textarea
            id='input-text'
            type='text'
            placeholder='New Note Text'></textarea>
        </div>

        {/* development asset */}
        <CustomButton
          style={{ bottom: '0px', left: '0px', position: 'absolute' }}
          onClick={() => console.log(this.state)}>
          Log Board State
        </CustomButton>
        {/* development asset */}

      </div>
    )
  }
}

export default Board
