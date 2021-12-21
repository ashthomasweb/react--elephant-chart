import React, { Component } from 'react'

import NoteItem from '../note-item/note-item.component'
import Header from '../../components/header/header.component'

import trashTop from '../../assets/trash-top.png'
import trashBottom from '../../assets/trash-bottom.png'

import { saveUserBoard, userBoards, deleteUserBoard } from '../../firebase/firebase.utils'
import { initialArray } from '../../assets/initial-array.js'
import { trashBox, trashHandler } from '../../methods/trash/trashHandlers.js'
import { indexFinder, zIndexFinder, zIndexDrag } from '../../methods/finders/num-finders.js'
import { newNoteGenerator } from '../../methods/new-note/new-note'
import { startUpdate, updateNote } from '../../methods/update/update-display'

import './board.styles.scss'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUpdateId: 1,
      updateCycleActive: false,
      prevNote: {
        color: '#f2ecb3',
        width: '',
        height: '',
      },
      newNote: {
        id: 1,
        width: '',
        height: '',
        top: '',
        left: '',
        zIndex: 0,
        mouseOffsetX: 0,
        mouseOffsetY: 0,
        noteText: '',
        border: 'none',
        noteBColor: '#f2ecb3',
        isMatBoard: false,
        isChecked: false,
      },
      boardObj: {
        name: '',
        notes: [],
        backgroundColor: '#1670d7',
      },
      initialNoteDisplay: true,
      initialArray: initialArray,
      notes: initialArray,
    }

  }


  $ = (input) => document.querySelector(input)

  positionUpdater = (input, e, final = false) => { 
    if (input) {

      let newNote = { ...input }
      let notes = [...this.state.notes]
      let newIndex = indexFinder(notes, newNote.id)
      notes[newIndex] = newNote
      notes[newIndex].zIndex = zIndexDrag(this.state.notes, newNote.isMatBoard)
      this.setState({ notes })
    }
    final === false && trashBox(e)
  }

  dropHandler = async (e) => {
    this.positionUpdater(null, e, true)
    let notesArray = [...this.state.notes]
    let notes = await trashHandler(e, notesArray)
    const isMatch = notes.some(elem => elem.id === this.state.currentUpdateId)
    if (isMatch === false) {
      this.cancelUpdateMode(true)
    }
    console.log(isMatch)
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

  newMatHandler = () => {
    this.newNoteHandler(true)
  }

  newNoteHandler = async (isMat) => {
    let notes = await newNoteGenerator(this.state, isMat)
    if ( this.state.updateCycleActive === true ) {
      notes[notes.length-1].noteBColor = this.$('.pad-frame').style.backgroundColor
    }
    this.setState({ notes })
    this.cancelUpdateMode()
  }

  // data handling methods for user board storage. Database calls BELOW.
  saveCurrentBoard = () => {
    let saveInput = this.$('.save-board-input')
    let boardObj = {
      name: saveInput.value,
      notes: [...this.state.notes],
      backgroundColor: this.state.boardObj.backgroundColor
    }
    this.setState({ boardObj }, () => {
      // save board to firestore
      this.saveBoardToDatabase(boardObj)
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

  newBoard = () => {
    let notes = []
    this.$('#input-text').innerHTML = ''
    this.cancelUpdateMode()
    this.setState({ notes })
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
    
    let padFrame = this.$('.pad-frame')
    this.cancelUpdateMode()
    let notes = [...this.state.notes]
    // set which note id to update
    let prevNote = {...this.state.prevNote}
    let prevNoteColor = this.$('#note-color-pick').value
    prevNote.color = prevNoteColor
    prevNote.width = getComputedStyle(padFrame).getPropertyValue('width')
    prevNote.height = getComputedStyle(padFrame).getPropertyValue('height')
    let currentUpdateId = id
    let updateCycleActive = true
    this.setState({ currentUpdateId, prevNote, updateCycleActive }, () => startUpdate(id, notes))
  }

  updateNoteHandler = async () => {
    let notesArray = [...this.state.notes]
    let id = this.state.currentUpdateId
    let notes = await updateNote(id, notesArray)
    this.setState({ notes })
    this.cancelUpdateMode(true)
  }

  cancelUpdateMode = (reset=false) => {
    let id = this.state.currentUpdateId
    let padFrame = this.$('.pad-frame')
    let noteColorPicker = this.$('#note-color-pick')
    let inputText = this.$('#input-text')

    if (reset === true) {
      padFrame.style.setProperty('background-color', this.state.prevNote.color)
      padFrame.style.setProperty('height', this.state.prevNote.height)
      padFrame.style.setProperty('width', this.state.prevNote.width)
      noteColorPicker.value = this.state.prevNote.color
      inputText.innerHTML = ''
    } 
    if (document.getElementById(`${id}`)) {
      document.getElementById(`${id}`).classList.remove('selected')
      this.$('.update-frame').classList.remove('selected')
    }
    let updateCycleActive = false
    this.setState({ updateCycleActive })
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
        let boardObj = board
        await this.setState({ notes }, () => this.forceUpdate() )
        notes = [...board.notes]
        
        if (boardObj.backgroundColor === undefined) {
          boardObj.backgroundColor = '#1670d7'
        } 
        this.setState({ notes, boardObj }, () => {
          this.displayUpdate()
          boardInput.value = board.name
          parentMenuCont.style.display = 'none'
        })
      })
      cont.appendChild(xButton)
      cont.appendChild(button)
      newMenu.appendChild(cont)
    })
    parentMenuCont.appendChild(newMenu)
  }

  // background color styling
  setBackgroundColor = () => {
    let boardObj = {...this.state.boardObj}
    let color = this.$('#bg-color-pick').value
    boardObj.backgroundColor = color
    this.setState({ boardObj })
  }

  setNoteColor = () => {
    let newNote = {...this.state.newNote}
    let noteBColor = this.$('#note-color-pick').value
    let prevNote = {...this.state.prevNote}
    prevNote.color = noteBColor
    newNote.noteBColor = noteBColor
    this.setState({ newNote, prevNote })
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
  
  displayUpdate = () => {
    this.$('#note-color-pick').defaultValue = this.state.newNote.noteBColor
    this.$('#bg-color-pick').defaultValue = this.state.boardObj.backgroundColor
  }

  componentDidMount() {
    this.displayUpdate()
  }

  checkHandler = (input, id) => {
    let bool = input
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, id)
    notes[newIndex].isChecked = bool
    this.setState({ notes })
  }


  render() {
    return (
      <div 
      className='board-backing' 
      onDrop={this.dropHandler}
      style={{backgroundColor: this.state.boardObj.backgroundColor}}
      >
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
            checkHandler={this.checkHandler}
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
            <button type='button' className='new-button' onClick={() => this.newBoard()}>
              New Board
            </button>
            <button type='button' style={{width: '135px'}} onClick={() => this.userBoardDropDown()}>
              Your Saved Boards
            </button>
            <div className='board-drop'></div>
          </div>

          <button
            className='place-btn'
            type='button'
            onClick={() => this.newNoteHandler()}>
            Place on Board
          </button>
          <button
            className='options-btn mat'
            type='button'
            onClick={() => this.newMatHandler()}>
            Mat
          </button>

          <button type='button' className='color-elements' onClick={this.setBackgroundColor} >Set Background</button>
          <input type='color' className='color-elements'  id='bg-color-pick' ></input>
          <button type='button' className='color-elements' style={{width: '110px'}} onClick={this.setNoteColor} >Set Note Color</button>
          <input type='color' className='color-elements'  id='note-color-pick' ></input>
          <label className="switch">
          <label htmlFor='check-toggle' className='check-label'>Check Off Note</label>
            <input id='check-toggle' type="checkbox"/>
            <span className="slider round"></span>
          </label>
        </div>
        <div className='update-frame'>
          <button
            className='update-btn'
            type='button'
            onClick={this.updateNoteHandler}>
            Update
          </button>
          <button
            className='update-btn'
            type='button'
            onClick={() => this.cancelUpdateMode(true)}>
            Cancel Update
          </button>
        </div>
        <div
          className='pad-frame'
          style={{ backgroundColor: this.state.newNote.noteBColor }}>
          <div
            id='input-text'
            contentEditable='true'
            ></div>
        </div>
<button type='button' style={{position: 'absolute', top: '0', height: '30px', zIndex: '9999999999'}} onClick={() => console.log(this.state)} >Board State</button>

        <div className='trash-frame'>
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

