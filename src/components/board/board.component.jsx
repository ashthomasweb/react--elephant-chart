import React, { Component } from 'react'

import NoteItem from '../note-item/note-item.component'
import Header from '../../components/header/header.component'

import trashTop from '../../assets/trash-top.png'
import trashBottom from '../../assets/trash-bottom.png'
import { initialArray } from '../../assets/initial-array.js'

import {
  saveUserBoard,
  userBoards,
  deleteUserBoard,
} from '../../firebase/firebase.utils'
import { trashBox, trashHandler } from '../../methods/trash/trashHandlers.js'
import { indexFinder, zIndexDrag } from '../../methods/finders/num-finders.js'
import { newNoteGenerator, rgbToHex } from '../../methods/new-note/new-note'
import {
  startUpdate,
  updateNote,
  cancelUpdate,
} from '../../methods/update/update-display'
import { getGroupIds } from '../../methods/mat-methods/find-group'
import { dropHelper } from '../../methods/menus/drop-helper'

import './board.styles.scss'

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUpdateId: 0,
      uiZoom: 1.1,
      boardZoom: 0,
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
        trayText: '',
        isTrayDisplay: false,
        trayWidth: '150px',
        trayHeight: '200px',
        border: 'none',
        noteBColor: '#f2ecb3',
        isMatBoard: false,
        isNew: true,
        noteGroup: [],
        matOffsetX: 0,
        matOffsetY: 0,
        isChecked: false,
        iframe: false
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

  positionUpdater = async (noteState, e, final = false, matPack = []) => {
    let notes = [...this.state.notes]
    if (noteState) {
      let newNote = { ...noteState }
      notes[indexFinder(notes, newNote.id)] = newNote
      newNote.zIndex = zIndexDrag(this.state.notes, newNote.isMatBoard)
      if (newNote.noteGroup.length > 0) {
        newNote.noteGroup.forEach( (note) => {
          if (notes[indexFinder(notes, note)].isMatBoard) {
            notes[indexFinder(notes, note)].zIndex = zIndexDrag(this.state.notes, true)
          }
        })
      }
      matPack.length > 0 && (notes = await this.matUpdater(matPack, notes))
      this.setState({ notes })
    }
    final === false && trashBox(e)
  }

  dropHandler = async (e) => {
    this.positionUpdater(null, e, true)
    let notes = await trashHandler(e, [...this.state.notes])
    let isMatch = notes.some((elem) => elem.id === this.state.currentUpdateId)
    ;(isMatch === false) & (this.state.currentUpdateId !== 0) &&
      this.cancelUpdateMode(true)
    if (notes[indexFinder(notes, e.target.id)])
      notes[indexFinder(notes, e.target.id)].isNew = false
    this.setState({ notes })
  }

  resize = (id, width, height) => {
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, id)
    let newNote = { ...notes[newIndex] }
    newNote = {
      ...newNote,
      width: width,
      height: height,
      zIndex: notes[newIndex].zIndex,
    }
    notes[newIndex] = newNote
  }

  findMatGroup = async (id) => {
    let notes = [...this.state.notes]
    let noteGroup = await getGroupIds(id, notes)
    notes[indexFinder(notes, id)].noteGroup = noteGroup
    this.setState({ notes }, () => this.assignMatOffset(id, noteGroup))
  }

  matUpdater = (matPack, notes) => {
    const [matId, noteGroup, e] = matPack
    let mat = notes[indexFinder(notes, matId)]
    noteGroup.forEach((item) => {
      let note = notes[indexFinder(notes, item)]
      if (e.clientX !== 0) {
        note.left = parseFloat(mat.left) - note.matOffsetX + 'px'
        note.top = parseFloat(mat.top) - note.matOffsetY + 'px'
      }
    })
    return notes
  }

  assignMatOffset = (id, noteGroup) => {
    let notes = [...this.state.notes]
    let mat = notes[indexFinder(notes, id)]
    noteGroup.forEach((itemID) => {
      let note = notes[indexFinder(notes, itemID)]
      note.matOffsetX = parseFloat(mat.left) - parseFloat(note.left)
      note.matOffsetY = parseFloat(mat.top) - parseFloat(note.top)
    })
    this.setState({ notes })
  }

  embedBrowser = async () => {
    if (
      window.confirm(
        `Are you sure? Opening untrusted sites can prevent a security risk. Highly recommend only embedding high-level, reputable sites like Google, YouTube, Facebook, Spotify, Widipedia, or similar. This will create an iframe element. Use feature at your own risk.`
      )
    ) {
      await this.newNoteHandler(false, true)
    }

  }

  newMatHandler = () => {
    this.newNoteHandler(true)
  }

  newNoteHandler = async (isMat, isEmbed) => {
    let notes = await newNoteGenerator(this.state, isMat, isEmbed)
    this.state.updateCycleActive &&
      (notes[notes.length - 1].noteBColor = rgbToHex(
        this.$('.pad-frame').style.backgroundColor
      ))
    this.setState({ notes })
    this.state.updateCycleActive && this.cancelUpdateMode(true)
  }

  // data handling methods for user board storage. Database calls BELOW.
  saveCurrentBoard = () => {
    let boardObj = {
      name: this.$('.save-board-input').value,
      notes: [...this.state.notes],
      backgroundColor: this.state.boardObj.backgroundColor,
    }
    this.setState({ boardObj }, () => {
      this.saveBoardToDatabase(boardObj)
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

  newBoard = () => {
    let notes = [this.state.initialArray[0]]
    this.$('#input-text').innerHTML = ''
    this.cancelUpdateMode()
    this.setState({ notes })
  }

  // confirmation request, then firestore method
  deleteBoardHandler = async (boardName) => {
    let dropMenu = this.$('.board-drop')
    if (
      window.confirm(
        `Are you sure you want to delete the board "${boardName}"? Action is permanent! However, this will NOT delete the notes from the screen, only the board in the database.`
      )
    ) {
      await deleteUserBoard(this.props.currentUser.auth, boardName)
      dropMenu.style.display = 'none'
    }
  }

  // Update state and display properties of notes. NOT database calls.
  startUpdateHandler = (currentUpdateId) => {
    this.cancelUpdateMode()
    let prevNote = {
      ...this.state.prevNote,
      color: this.$('#note-color-pick').value,
      width: getComputedStyle(this.$('.pad-frame')).getPropertyValue('width'),
      height: getComputedStyle(this.$('.pad-frame')).getPropertyValue('height'),
    }
    let updateCycleActive = true
    this.setState({ currentUpdateId, prevNote, updateCycleActive }, () =>
      startUpdate(currentUpdateId, [...this.state.notes])
    )
  }

  updateNoteHandler = async () => {
    let notes = await updateNote(this.state.currentUpdateId, [
      ...this.state.notes,
    ])
    this.setState({ notes })
    this.cancelUpdateMode(true)
  }

  cancelUpdateMode = (reset = false) => {
    cancelUpdate(reset, this.state.currentUpdateId, this.state.prevNote)
    let updateCycleActive = false
    this.setState({ updateCycleActive })
  }

  userBoardDropDown = () => {
    let el = this.$('.board-drop').style
    this.putBoardsToList()
    el.display === 'block' ? (el.display = 'none') : (el.display = 'block')
  }

  putBoardsToList = () => {
    let parentMenuCont = this.$('.board-drop')
    let newMenu = document.createElement('div')
    if (parentMenuCont.firstChild)
      parentMenuCont.removeChild(parentMenuCont.firstChild)
    userBoards.forEach((boardObj) => {
      const [cont, button, xButton] = dropHelper(boardObj)
      this.buildBoardButton(boardObj, button, xButton)
      cont.append(xButton, button)
      newMenu.append(cont)
    })
    parentMenuCont.append(newMenu)
  }

  buildBoardButton = (boardObj, button, xButton) => {
    xButton.addEventListener('click', () =>
      this.deleteBoardHandler(boardObj.name)
    )
    button.addEventListener('click', async () => {
      let notes = []
      await this.setState({ notes }, () => this.forceUpdate())
      notes = [...boardObj.notes]
      boardObj.backgroundColor ?? (boardObj.backgroundColor = '#1670d7')
      this.setState({ notes, boardObj }, () => {
        this.displayUpdate()
        this.$('.save-board-input').value = boardObj.name
        this.$('.board-drop').style.display = 'none'
      })
    })
  }

  passTrayText = (id, trayText) => {
    let notes = [...this.state.notes]
    let noteToUpdate = { ...notes[indexFinder(notes, id)] }
    noteToUpdate.trayText = trayText
    notes[indexFinder(notes, id)] = noteToUpdate
    this.setState({ notes })
  }

  trayHandler = (isTrayDisplay, id) => {
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, id)
    let newNote = notes[newIndex]
    newNote.isTrayDisplay = isTrayDisplay
    notes[newIndex] = newNote
    this.setState({ notes })
  }

  traySize = (id, w, h) => {
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, id)
    let newNote = notes[newIndex]
    newNote.trayWidth = w
    newNote.trayHeight = h
    notes[newIndex] = newNote
    this.setState({ notes })
  }



  iframeSize = (id, w, h) => {
    let notes = [...this.state.notes]
    let newIndex = indexFinder(notes, id)
    let newNote = notes[newIndex]
    newNote.iframeWidth = w
    newNote.iframeHeight = h
    notes[newIndex] = newNote
    this.setState({ notes })
  }



  setBackgroundColor = () => {
    let boardObj = { ...this.state.boardObj }
    boardObj.backgroundColor = this.$('#bg-color-pick').value
    this.setState({ boardObj })
  }

  setNoteColor = () => {
    let newNote = { ...this.state.newNote }
    let noteBColor = this.$('#note-color-pick').value
    let prevNote = { ...this.state.prevNote }
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

  checkHandler = (bool, id) => {
    let notes = [...this.state.notes]
    notes[indexFinder(notes, id)].isChecked = bool
    this.setState({ notes })
  }

  displayUpdate = () => {
    let bg = this.state.boardObj.backgroundColor
    this.$('#note-color-pick').defaultValue = this.state.newNote.noteBColor
    this.$('#bg-color-pick').defaultValue = bg.length > 7 ? '#1670d7' : bg
  }

  componentDidMount() {
    this.displayUpdate()
    // drag board listener and handler
    window.addEventListener('mousedown', (e) => {
      if (e.target.id === 'backing') {
        let board = e.target
        let initialClientX = e.clientX
        let initialClientY = e.clientY
        let initialScrollX = board.scrollLeft
        let initialScrollY = board.scrollTop
        let logPosition = (e) => {
          let xFromOrigin = e.clientX - initialClientX
          let yFromOrigin = e.clientY - initialClientY
          board.scrollTo(
            initialScrollX - xFromOrigin,
            initialScrollY - yFromOrigin
          )
        }
        window.addEventListener('mousemove', logPosition)
        window.addEventListener('mouseup', (e) => {
          window.removeEventListener('mousemove', logPosition)
        })
      }
    })
    window.addEventListener('resize', () => {
      let ui = [
        '.options-frame',
        '.header',
        '.pad-frame',
        '.update-frame',
        '.trash-frame',
      ]
      ui.forEach((item) => {
        document.querySelector(item).style.zoom = `calc(100% / ${
          this.state.uiZoom * window.devicePixelRatio
        })`
      })
    })
  }

  zoomIntDir = (directionUp) => {
    let uiZoom = this.state.uiZoom
    directionUp ? (uiZoom = uiZoom - 0.14) : (uiZoom = uiZoom + 0.14)
    let zoom
    zoom = window.devicePixelRatio * uiZoom
    let ui = [
      '.options-frame',
      '.header',
      '.pad-frame',
      '.update-frame',
      '.trash-frame',
    ]
    ui.forEach((item) => {
      document.querySelector(item).style.zoom = `calc(100% / ${zoom})`
    })
    this.setState({ uiZoom })
  }

  render() {
    return (
      <div
        id='backing'
        className='board-backing'
        onDrop={this.dropHandler}
        style={{ backgroundColor: this.state.boardObj.backgroundColor }}>
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
            edit={this.startUpdateHandler}
            initialDisplay={this.state.initialNoteDisplay}
            checkHandler={this.checkHandler}
            findMatGroup={this.findMatGroup}
            passTrayText={this.passTrayText}
            trayHandler={this.trayHandler}
            traySize={this.traySize}
            iframeSize={this.iframeSize}
            {...noteProps}
          />
        ))}

        <div className='options-frame'>
          <div className='zoom-options'>
            <h3>Zoom</h3>
            <h4>Interface</h4>
            <button type='button' onClick={() => this.zoomIntDir(false)}>
              -
            </button>
            <button type='button' onClick={() => this.zoomIntDir(true)}>
              +
            </button>
            <h4 style={{ marginTop: '3px' }}>Board</h4>
            <p>
              Hold CTRL
              <br /> + Wheel
            </p>
          </div>

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
            <button
              type='button'
              className='new-button'
              onClick={() => this.newBoard()}>
              New Board
            </button>
            <button
              type='button'
              style={{ width: '135px' }}
              onClick={() => this.userBoardDropDown()}>
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
          <button
            type='button'
            className='color-elements'
            onClick={this.setBackgroundColor}>
            Set Background
          </button>
          <input
            type='color'
            className='color-elements'
            id='bg-color-pick'></input>
          <button
            type='button'
            className='color-elements'
            style={{ width: '110px' }}
            onClick={this.setNoteColor}>
            Set Note Color
          </button>
          <input
            type='color'
            className='color-elements'
            id='note-color-pick'></input>
          <label className='switch'>
            <label htmlFor='check-toggle' className='check-label'>
              Check
            </label>
            <input id='check-toggle' type='checkbox' />
            <span className='slider round'></span>
          </label>
          <button
          type='button'
          className='embed-btn'
          onClick={() => this.embedBrowser()}
          >Embed</button>
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
          <div id='input-text' contentEditable='true'></div>
        </div>

        <div className='trash-frame'>
          <div className='trash-cont'>
            <img
              src={trashTop}
              className='trash-top'
              alt='Lid of recycle can'
            />
            <img
              src={trashBottom}
              className='trash-bottom'
              alt='Body of recycle can'
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Board

//   <button
//   type='button'
//   style={{
//     position: 'absolute',
//     height: '30px',
//     top: '0',
//     left: '0',
//     zIndex: '9999999999',
//   }}
//   onClick={() => {
//     // console.log(this.state.notes)
//     this.coordFinder()
//   }}
//   >
//   Board Notes
// </button>
