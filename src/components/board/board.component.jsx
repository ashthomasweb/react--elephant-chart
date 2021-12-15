import React, { Component } from 'react'

import NoteItem from '../note-item/note-item.component'
import Header from '../../components/header/header.component'

import blankYellow from '../../assets/trimmed-noborder.png'

import trashTop from '../../assets/trash-top.png'
import trashBottom from '../../assets/trash-bottom.png'

import { saveUserBoard, userBoards, deleteUserBoard } from '../../firebase/firebase.utils'
import { initialArray } from '../../assets/initial-array.js'
import { trashBox, trashHandler } from '../../methods/trash/trashHandlers.js'
import { indexFinder, zIndexFinder } from '../../methods/finders/num-finders.js'
import { newNoteGenerator } from '../../methods/new-note/new-note'

import './board.styles.scss'
import { startUpdate, updateNote } from '../../methods/update/update-display'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUpdateId: 0,
      newNote: {
        id: 1,
        width: '200px',
        height: '130px',
        top: '155px',
        left: '10px',
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
      initialNoteDisplay: true,
      initialArray: initialArray,
      notes: initialArray,
    }

  }

  $ = (input) => document.querySelector(input)

  positionUpdater = (input, e, final = false) => {
    let newNote = { ...input }
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, newNote.id)

    notes[newIndex] = newNote
    notes[newIndex].zIndex = zIndexFinder(this.state.notes)
    this.setState({ notes })
    // don't check for trash handling until drop
    final === false && trashBox(e)
  }

  dropHandler = async (e) => {
    this.positionUpdater(null, e, true)
    let notesArray = [...this.state.notes]
    let notes = await trashHandler(e, notesArray)
    this.setState({ notes })
  }

  resize = (id, width, height) => {
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, id)
    let newNote = { ...notes[newIndex] }

    newNote.width = width
    newNote.height = height
    newNote.zIndex = notes[newIndex].zIndex
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  newNoteGenerator = async () => {
    let notes = await newNoteGenerator(this.state)
    this.setState({ notes })
  }

  // data handling methods for user board storage. Database calls BELOW.
  saveCurrentBoard = () => {
    let saveInput = this.$('.save-board-input')
    let boardObj = {
      name: saveInput.value,
      notes: [...this.state.notes],
    }
    this.setState({ boardObj }, () => {
      // save board to firestore
      this.saveBoardToDatabase(this.state.boardObj)
    })
  }

  saveBoardToDatabase = (boardObj) => {
    if (this.props.currentUser === null) {
      // NEED localhost option
      console.log('no user')
    } else {
      // firebase utils export
      saveUserBoard(this.props.currentUser.auth, boardObj)
    }
  }

  // confirmation, then firestore method
  deleteBoardHandler = async (boardName) => {
    let dropMenu = this.$('.board-drop')
    if (
      window.confirm(
        `Are you sure you want to delete the board "${boardName}"? Action is permanent! however, this will NOT delete the notes from the screen, only the board in the database.`
      )
    ) {
      await deleteUserBoard(this.props.currentUser.auth, boardName)
      dropMenu.style.display = 'none'
    }
  }

  // Update state and display properties of notes. NOT database calls.
  startUpdateHandler = (id) => {
    let notes = [...this.state.notes]
    startUpdate(id, notes)
    // set which note id to update
    let currentUpdateId = id
    this.setState({ currentUpdateId })
  }

  updateNoteHandler = async () => {
    let notesArray = [...this.state.notes]
    let id = this.state.currentUpdateId
    let notes = await updateNote(id, notesArray)
    this.setState({ notes })
    this.cancelUpdateMode()
  }

  cancelUpdateMode = () => {
    let id = this.state.currentUpdateId
    document.getElementById(`${id}`).classList.remove('selected')
    this.$('.options-frame').classList.remove('selected')
  }

  // Drop Down Menu
  userBoardDropDown = () => {
    let elStyle = this.$('.board-drop').style
    // data handling
    this.putBoardsToList()
    // menu display toggle
    elStyle.display === 'block'
      ? (elStyle.display = 'none')
      : (elStyle.display = 'block')
  }

  putBoardsToList = () => {
    let parentMenuCont = this.$('.board-drop')
    let oldMenu = parentMenuCont.firstChild
    let boardInput = this.$('.save-board-input')
    let newMenu = document.createElement('div')

    // remove all previous board references
    if (oldMenu) parentMenuCont.removeChild(oldMenu)

    // repopulate with new elements
    userBoards.forEach((board) => {
      let cont = document.createElement('div')
      let xButton = document.createElement('button')
      let button = document.createElement('button')

      xButton.type = 'button'
      xButton.innerHTML = 'X'
      xButton.classList.add('delete')
      button.type = 'button'
      button.innerHTML = board.name
      cont.classList.add('button-cont')

      // confirmation, then firestore method
      xButton.addEventListener('click', () => {
        this.deleteBoardHandler(board.name)
      })
      button.addEventListener('click', async () => {
        let notes = []
        await this.setState({ notes }, () => this.forceUpdate() )
        notes = [...board.notes]
        this.setState({ notes })
        boardInput.value = board.name
        parentMenuCont.style.display = 'none'
      })
      cont.appendChild(xButton)
      cont.appendChild(button)
      newMenu.appendChild(cont)
    })
    parentMenuCont.appendChild(newMenu)
  }

  // used on new user and board load to prevent data leakage
  reRender = async () => {
    let notes = this.state.initialArray
    let dropMenu = this.$('.board-drop')
    let boardInput = this.$('.save-board-input')

    boardInput.value = ''
    dropMenu.style.display = 'none'
    await this.forceUpdate()
    this.userBoards = []
    this.setState({ notes })
  }

  render() {
    return (
      <div className='board-backing' onDrop={this.dropHandler}>
        <Header
          className='header'
          currentUser={this.props.currentUser}
          reset={this.reRender}
        />
        {this.state.notes.map(({ id, ...noteProps }) => (
          <NoteItem
            key={id}
            id={id}
            positionUpdater={this.positionUpdater}
            resizeHandler={this.resize}
            zHigh={() => zIndexFinder(this.state.notes)}
            edit={this.startUpdateHandler}
            initialDisplay={this.state.initialNoteDisplay}
            {...noteProps}
          />
        ))}
        <div className='options-frame'>

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
            <div className='board-drop'></div>
          </div>

          <button
            className='options-btn'
            type='button'
            onClick={this.newNoteGenerator}>
            Place on Board
          </button>
          <button
            className='options-btn'
            type='button'
            onClick={this.updateNoteHandler}>
            Update
          </button>
          <button
            className='options-btn'
            type='button'
            onClick={this.cancelUpdateMode}>
            Cancel Update
          </button>

        </div>
        <div
          className='pad-frame'
          style={{ backgroundImage: `url(${blankYellow})` }}>
          <div
            id='input-text'
            contentEditable='true'
            ></div>
        </div>
        <div className='trash-frame'>
          <h3>Recycle Can</h3>
          <div className='trash-cont'>
            <img src={trashTop} className='trash-top' alt='Lid of recycle can'/>
            <img src={trashBottom} className='trash-bottom' alt='Body of recycle can'/>
          </div>
        </div>

      </div>
    )
  }
}

export default Board
