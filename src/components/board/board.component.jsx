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
      currentUpdateId: 0,
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
        border: 'none',
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
          border: 'none',
        },
      ],
    }

    // not needed, anymore or ever?
    this.positionUpdater = this.positionUpdater.bind(this)
    // this.resizeHandler = this.resize.bind(this)
  }

  positionUpdater = (input) => {
    this.setState({ currentDrag: input })
    let newNote = { ...this.state.currentDrag }
    let newIndex = 0
    let notes = [...this.state.notes]
    newIndex = newNote.id - 1
    notes[newIndex] = newNote
    notes[newIndex].zIndex = this.zIndexFinder()
    this.setState({ notes })
  }

  resize = (id, width, height) => {
    let newNote = { ...this.state.notes[id - 1] }
    newNote.width = width
    newNote.height = height
    let notes = [...this.state.notes]
    let newIndex = newNote.id - 1
    newNote.zIndex = notes[newIndex].zIndex
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  zIndexFinder = (e) => {
    let zList = []
    this.state.notes.forEach((note) => {
      zList.push(note.zIndex)
    })
    // if (Math.max.apply(null, zList) > 1000000) {
    //   this.state.notes.forEach((note, i) => {
    //     note.zIndex = note.zIndex - 500000
    //   })
    // }
    // above is too minimal. Needs to retain stack order, but reduce zIndexes to a workable range, without taking them below 0
    // NEED conditional to reset index if too large...outlying case, but would stop the stacking ability if maxed.
    return Math.max.apply(null, zList) + 1
  }

  dropHandler = (e) => {
    this.positionUpdater()
  }

  newNoteGenerator = () => {
    // make new note
    let newNote = { ...this.state.newNote }
    let notes = [...this.state.notes]
    newNote.noteText = document.querySelector('#input-text').value
    newNote.id = this.newIdFinder()
    let el = document.querySelector('.pad-frame')
    newNote.left =
      parseFloat(getComputedStyle(el).getPropertyValue('left')) - 340 + 'px'
    newNote.top =
      parseFloat(getComputedStyle(el).getPropertyValue('top')) + 120 + 'px'
    notes.push(newNote)
    this.setState({ notes })
  }

  updateNoteTemp = () => {
    let id = this.state.currentUpdateId
    let notes = [...this.state.notes]
    let upNote = { ...this.state.notes[id - 1] }
    upNote.noteText = document.querySelector('#input-text').value
    upNote.id = id
    notes[id - 1] = upNote
    this.setState({ notes })
  }

  newIdFinder = (e) => {
    let idList = []
    this.state.notes.forEach((note) => {
      idList.push(note.id)
    })
    return Math.max.apply(null, idList) + 1
  }

  saveCurrentBoard = () => {
    let boardObj = {
      name: document.querySelector('.save-board-input').value,
      notes: [...this.state.notes],
    }
    this.setState({ boardObj }, () => {
      this.saveBoardToDatabase(this.state.boardObj)
    })
  }

  saveBoardToDatabase = (boardObj) => {
    if (this.props.currentUser === null) {
      // NEED localhost option
      console.log('no user')
    } else {
      saveUserBoard(this.props.currentUser.auth, boardObj)
    }
  }

  updateNote = (id) => {
    console.log(this.state.notes[id - 1])
    // highlight note to edit
    document.getElementById(`${id}`).classList.add('selected')
    // highlight compose area
    document.querySelector('.options-frame').classList.add('selected')
    // create 'off-click'
    // NEEDS better event handling
    document.querySelector('.board-backing').addEventListener(
      'click',
      (e) => {
        this.cancelUpdate(id)
      },
      false
    )
    // send note data to compose area
    document.getElementById('input-text').value =
      this.state.notes[id - 1].noteText
    // change compose area title
    // no title yet to change!
    // change compose area function
    let currentUpdateId = id
    this.setState({ currentUpdateId })
  }

  cancelUpdate = (id) => {
    document.getElementById(`${id}`).classList.remove('selected')
    document.querySelector('.options-frame').classList.remove('selected')

    document
      .querySelector('.board-backing')
      .removeEventListener('click', () => {
        this.cancelUpdate(id)
      })
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

    if (parentMenuCont.firstChild) {
      parentMenuCont.removeChild(oldMenu)
    }

    userBoards.forEach((board) => {
      let button = document.createElement('button')
      button.type = 'button'
      button.innerHTML = board.name
      button.addEventListener('click', async () => {
        let notes = []
        this.setState({ notes })
        await this.forceUpdate()
        notes = [...board.notes]
        this.setState({ notes })
        parentMenuCont.style.display = 'none'
      })
      newMenu.appendChild(button)
    })
    parentMenuCont.appendChild(newMenu)
  }

  render() {
    return (
      <div id='board' className='board-backing' onDrop={this.dropHandler}>
        {this.state.notes.map(({ id, ...noteProps }) => (
          <NoteItem
            key={id}
            positionUpdater={this.positionUpdater}
            resizeHandler={this.resize}
            zHigh={this.zIndexFinder}
            value={id}
            edit={this.updateNote}
            self={this.state.notes[id - 1]}
            {...noteProps}
          />
        ))}
        <div className='options-frame'>
          <button
            id='primary-compose'
            className='options-btn'
            type='button'
            onClick={this.newNoteGenerator}>
            Place on Board
          </button>
          <button
            className='options-btn'
            type='button'
            onClick={this.updateNoteTemp}>
            Update
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

        {/* development asset */}
      </div>
    )
  }
}

export default Board
