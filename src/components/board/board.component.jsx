import React, { Component } from 'react'

import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'

import blankYellow from '../../assets/trimmed-noborder.png'

import { saveUserBoard, userBoards } from '../../firebase/firebase.utils'

import './board.styles.scss'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentDrag: {},
      newNote: {
        id: 1,
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
    this.hal = this.resize.bind(this)
  }

  componentDidUpdate(input = false) {
    let oldBoard = document.getElementById('board')

    if (input === true) {
      console.log('hi')
      console.log(oldBoard)

      // for (let i = 0; i < oldBoard.children.length; i++) {
      //   console.log('num')

      // if (oldBoard.firstChild.className.includes('menu-item') === true ) {
      //     console.log('hi dave')
      //     oldBoard.removeChild(oldBoard.firstChild)
      //     // oldBoard.innerHTML = ''
      //   }
      // }
    }
  }

  callUpdate = () => {
    this.componentDidUpdate(true)
  }

  removeElem = () => {
    let oldBoard = document.getElementById('board')
    for (let i = 0; i < oldBoard.children.length; i++) {
      console.log('num')

      if (oldBoard.firstChild.className.includes('menu-item') === true) {
        console.log('hi dave')
        oldBoard.removeChild(oldBoard.firstChild)
        // oldBoard.innerHTML = ''
      }
    }
    // oldBoard.removeChild(oldBoard.firstChild)
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
    this.setState({ currentDrag: input }, () => {
      // console.log(this.state.currentDrag)
      let newNote = this.state.currentDrag
      console.log(newNote)
      let notes = [...this.state.notes]
      let newIndex = newNote.id - 1
      notes[newIndex] = newNote
      console.log(notes)
      this.setState({ notes }, () => {
        console.log(notes[newIndex])
        console.log(notes)
        // this.tester()
      })
    })
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

  userBoardDropDown = () => {
    this.putBoardsToList()
    let elStyle = document.querySelector('.board-drop').style
    elStyle.display === 'block'
      ? (elStyle.display = 'none')
      : (elStyle.display = 'block')
  }

  putBoardsToList = () => {
    let oldMenu = document.getElementById('board-drop').firstChild
    let parentMenuCont = document.getElementById('board-drop')
    let newMenu = document.createElement('div')
    // let oldBoard = document.getElementById('board')

    // console.log(oldBoard.firstChild.className.includes('menu-item'))
    // console.log(document.getElementsByTagName('NoteItem'))

    if (parentMenuCont.firstChild) {
      parentMenuCont.removeChild(oldMenu)
    }

    userBoards.forEach((board) => {
      let button = document.createElement('button')
      button.type = 'button'
      button.innerHTML = board.name
      button.addEventListener('click', () => {
        this.callUpdate()
        // while (oldBoard.firstChild.className.includes('menu-item') === true ) {
        //   console.log('hi dave')
        //   oldBoard.removeChild(oldBoard.firstChild)
        // }
        let notes = [...board.notes]
        this.setState({ notes }) // possible solution area to problem #1. Note component state not being updated with the board state.
        document.querySelector('.board-drop').style.display = 'none'
      })
      newMenu.appendChild(button)
    })
    document.querySelector('.board-drop').appendChild(newMenu)
  }

  render() {
    return (
      <div id='board' className='board-backing' onDrop={this.dropHandler}>
        {this.state.notes.map(({ id, ...noteProps }) => (
          <NoteItem
            key={id}
            dave={this.tester}
            hal={this.resize}
            zHigh={this.zIndexFinder}
            value={id}
            // self={this.state.notes[id-1]}
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
            <button type='button' onClick={() => this.userBoardDropDown()}>
              Your Boards
            </button>
            <div id='board-drop' className='board-drop'></div>
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
        <CustomButton
          style={{ bottom: '0px', left: '400px', position: 'absolute' }}
          onClick={() => console.log(userBoards)}>
          Log userBoards
        </CustomButton>
        <CustomButton
          style={{ bottom: '0px', left: '550px', position: 'absolute' }}
          onClick={() => this.removeElem()}>
          Remove test
        </CustomButton>
        {/* development asset */}
      </div>
    )
  }
}

export default Board
