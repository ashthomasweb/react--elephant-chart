import React, { Component } from 'react'

import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'
import Header from '../../components/header/header.component'

import blankYellow from '../../assets/trimmed-noborder.png'

import { saveUserBoard, userBoards, deleteUserBoard } from '../../firebase/firebase.utils'
import { initialArray } from '../../assets/initial-array.js'
import { trashBox, trashHandler } from '../../methods/trash/trashHandlers.js'
import { newIdFinder, zIndexFinder } from '../../methods/finders/num-finders.js'

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

    // not needed, anymore or ever?
    this.positionUpdater = this.positionUpdater.bind(this)

    
  }

  // jQuery-esque universal selector
  $ = (input) => document.querySelector(input)

  positionUpdater = (input, e, final = false) => {
    this.setState({ currentDrag: input })
    let newNote = { ...this.state.currentDrag }
    let notes = [...this.state.notes]
    let newIndex
    notes.forEach((note) => {
      if (note.id === newNote.id) {
        newIndex = notes.indexOf(note)
      }
    })
    notes[newIndex] = newNote
    notes[newIndex].zIndex = zIndexFinder(this.state)
    this.setState({ notes })
    final === false && trashBox(e)
  }

  dropHandler = async (e) => {
    this.positionUpdater(null, e, true)
    let notesArray = [...this.state.notes]
    let notes = await trashHandler(e, notesArray)
    this.setState({notes})
  }

  resize = (id, width, height) => {
    let notes = [...this.state.notes]
    let newIndex
    notes.forEach((note) => {
      if (note.id === id) {
        newIndex = notes.indexOf(note)
      }
    })

    let newNote = { ...this.state.notes[newIndex] }
    newNote.width = width
    newNote.height = height
    newNote.zIndex = notes[newIndex].zIndex
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  newNoteGenerator = () => {
    let newNote = { ...this.state.newNote }
    let notes = [...this.state.notes]
    let textarea = this.$('.pad-frame')
    let inputText = this.$('#input-text')
    newNote.noteText = inputText.innerText
    newNote.id = newIdFinder(this.state)
    newNote.width = getComputedStyle(textarea).getPropertyValue('width')
    newNote.height = getComputedStyle(textarea).getPropertyValue('height')
    newNote.left =
      parseFloat(getComputedStyle(textarea).getPropertyValue('left')) - Math.floor(Math.random() * 70) - 440 + 'px'
    newNote.top =
      parseFloat(getComputedStyle(textarea).getPropertyValue('top')) + Math.floor(Math.random() * 70) + 240 + 'px'
    notes.push(newNote)
    this.setState({ notes })
    inputText.innerText = ''
  }




  saveCurrentBoard = () => {
    let saveInput = this.$('.save-board-input')
    let boardObj = {
      name: saveInput.value,
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

  updateNote = () => {
    let inputText = this.$('#input-text')
    let padFrame = this.$('.pad-frame')
    let notes = [...this.state.notes]
    let newIndex
    let id = this.state.currentUpdateId

    notes.forEach((note) => {
      if (note.id === id) {
        newIndex = notes.indexOf(note)
      }
    })
    
    let upNote = { ...this.state.notes[newIndex] }
    upNote.noteText = inputText.innerText
    upNote.width = getComputedStyle(padFrame).getPropertyValue('width')
    upNote.height = getComputedStyle(padFrame).getPropertyValue('height')
    upNote.id = id
    notes[newIndex] = upNote
    this.setState({ notes }, () => console.log(this.state) )
    inputText.innerText = ''
    this.cancelUpdate()
  }

  startUpdate = (id) => {
    let notes = [...this.state.notes]
    let newIndex
    let noteToUpdate = document.getElementById(`${id}`)
    let inputText = this.$('#input-text')
    let opFrame = this.$('.options-frame')
    let padFrame = this.$('.pad-frame')

    // find index of note to update
    notes.forEach((note) => {
      if (note.id === id) {
        newIndex = notes.indexOf(note)
      }
    })

    // display cues
    noteToUpdate.classList.add('selected')
    opFrame.classList.add('selected')

    // send note data to compose area
    inputText.innerText = notes[newIndex].noteText
    padFrame.style.setProperty('width', notes[newIndex].width)
    padFrame.style.setProperty('height', notes[newIndex].height)

    // set which note id to update
    let currentUpdateId = id
    this.setState({ currentUpdateId })
  }

  // reset update process, turn off display cues
  cancelUpdate = () => {
    let id = this.state.currentUpdateId
    document.getElementById(`${id}`).classList.remove('selected')
    this.$('.options-frame').classList.remove('selected')
  }

  // confirmation, then firestore method
  deleteBoardHandler = async (boardName) => {
    if (window.confirm(`Are you sure you want to delete the board "${boardName}" ? Action is permanent! however, this will NOT delete the notes from the screen, only the board in the database.`)) {
      await deleteUserBoard(this.props.currentUser.auth, boardName)
      this.$('.board-drop').style.display = 'none'
    }
  }
  
  userBoardDropDown = () => {
    // data handling
    this.putBoardsToList()
    // menu display toggle
    let elStyle = this.$('.board-drop').style
    elStyle.display === 'block'
      ? (elStyle.display = 'none')
      : (elStyle.display = 'block')
  }

  putBoardsToList = () => {
    let parentMenuCont = this.$('#board-drop')
    let oldMenu = parentMenuCont.firstChild
    let newMenu = document.createElement('div')
    let boardInput = this.$('.save-board-input')

    // remove all previous board references
    if (oldMenu) {
      parentMenuCont.removeChild(oldMenu)
    }

    // repopulate with new elements
    userBoards.forEach((board) => {
      let cont = document.createElement('div')
      let button = document.createElement('button')
      let xButton = document.createElement('button')

      button.type = 'button'
      button.innerHTML = board.name
      xButton.type = 'button'
      xButton.innerHTML = 'X'
      xButton.classList.add('delete')
      cont.classList.add('button-cont')

      // confirmation, then firestore method
      xButton.addEventListener('click', () => {
        this.deleteBoardHandler(board.name)
      })

      button.addEventListener('click', async () => {
        let notes = []
        this.setState({ notes })
        await this.forceUpdate()
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
    this.$('.save-board-input').value = ''
    this.$('.board-drop').style.display = 'none'
    await this.forceUpdate()
    this.userBoards = []
    this.setState({ notes })
  }

  render() {
    return (
      <div id='board' className='board-backing' onDrop={this.dropHandler}>
        <Header
          className='header'
          currentUser={this.props.currentUser}
          reset={this.reRender}
        />
        {this.state.notes.map(({ id, ...noteProps }) => (
          <NoteItem
            key={id}
            positionUpdater={this.positionUpdater}
            resizeHandler={this.resize}
            zHigh={() => zIndexFinder(this.state)}
            value={id}
            edit={this.startUpdate}
            initialDisplay={this.state.initialNoteDisplay}
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
            onClick={this.updateNote}>
            Update
          </button>
          <button
            className='options-btn'
            id='cancel-update'
            type='button'
            onClick={this.cancelUpdate}>
            Cancel Update
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
        <div className='pad-frame'style={{backgroundImage: `url(${blankYellow})`, display: 'table'}}>
          <div id='input-text' contentEditable='true' style={{display: 'table-cell', verticalAlign: 'middle'}} >
          </div>
        </div>
        <div className='trash-frame'>
          <h3>Trash Can</h3>
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
