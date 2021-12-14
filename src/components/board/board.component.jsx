import React, { Component } from 'react'

import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'
import Header from '../../components/header/header.component'

import blankYellow from '../../assets/trimmed-noborder.png'

import { saveUserBoard, userBoards, deleteUserBoard } from '../../firebase/firebase.utils'
import { initialArray } from '../../assets/initial-array.js'
import { trashBox, trashHandler } from '../../methods/trash/trashHandlers.js'

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
    notes[newIndex].zIndex = this.zIndexFinder()
    this.setState({ notes })
    final === false && trashBox(e)
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

  dropHandler = async (e) => {
    this.positionUpdater(null, e, true)
    let notesArray = [...this.state.notes]
    let notes = await trashHandler(e, notesArray)
    this.setState({notes})
  }

  newNoteGenerator = () => {
    let newNote = { ...this.state.newNote }
    let notes = [...this.state.notes]
    let textarea = document.querySelector('.pad-frame')
    newNote.noteText = document.querySelector('#input-text').innerText
    newNote.id = this.newIdFinder()
    newNote.width = getComputedStyle(textarea).getPropertyValue('width')
    newNote.height = getComputedStyle(textarea).getPropertyValue('height')
    let el = document.querySelector('.pad-frame')
    newNote.left =
      parseFloat(getComputedStyle(el).getPropertyValue('left')) - Math.floor(Math.random() * 70) - 440 + 'px'
    newNote.top =
      parseFloat(getComputedStyle(el).getPropertyValue('top')) + Math.floor(Math.random() * 70) + 240 + 'px'
    notes.push(newNote)
    this.setState({ notes })
    document.querySelector('#input-text').innerText = ''
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

  updateNote = () => {
    let notes = [...this.state.notes]
    let newIndex
    let id = this.state.currentUpdateId
    notes.forEach((note) => {
      if (note.id === id) {
        newIndex = notes.indexOf(note)
      }
    })
    let upNote = { ...this.state.notes[newIndex] }
    upNote.noteText = document.querySelector('#input-text').innerText
    upNote.width = getComputedStyle(document.querySelector('.pad-frame')).getPropertyValue('width')
    upNote.height = getComputedStyle(document.querySelector('.pad-frame')).getPropertyValue('height')
    upNote.id = id
    notes[newIndex] = upNote
    this.setState({ notes }, () => console.log(this.state) )
    document.querySelector('#input-text').innerText = ''
    this.cancelUpdate()
  }

  startUpdate = (id) => {
    let notes = [...this.state.notes]
    let newIndex
    notes.forEach((note) => {
      if (note.id === id) {
        newIndex = notes.indexOf(note)
      }
    })
    // highlight note to edit
    document.getElementById(`${id}`).classList.add('selected')
    // highlight compose area
    document.querySelector('.options-frame').classList.add('selected')
    // send note data to compose area
    document.getElementById('input-text').innerText =
      this.state.notes[newIndex].noteText
    document.querySelector('.pad-frame').style.setProperty('width', this.state.notes[newIndex].width)
    document.querySelector('.pad-frame').style.setProperty('height', this.state.notes[newIndex].height)
    // set which note id to update
    let currentUpdateId = id
    this.setState({ currentUpdateId })
  }

  cancelUpdate = () => {
    let id = this.state.currentUpdateId
    document.getElementById(`${id}`).classList.remove('selected')
    document.querySelector('.options-frame').classList.remove('selected')
  }

  userBoardDropDown = () => {
    this.putBoardsToList()
    let elStyle = document.querySelector('.board-drop').style
    elStyle.display === 'block'
      ? (elStyle.display = 'none')
      : (elStyle.display = 'block')
  }

  deleteBoardHandler = async (boardName) => {
    if (window.confirm('Are you sure you want to delete this board? Action is permanent. Action will NOT delete the notes from the screen, only the board in the database.')) {
      console.log('yes')
      await deleteUserBoard(this.props.currentUser.auth, boardName)
      document.querySelector('.board-drop').style.display = 'none'
    }


  }

  putBoardsToList = () => {
    let oldMenu = document.getElementById('board-drop').firstChild
    let parentMenuCont = document.getElementById('board-drop')
    let newMenu = document.createElement('div')

    if (parentMenuCont.firstChild) {
      parentMenuCont.removeChild(oldMenu)
    }

    userBoards.forEach((board) => {
      let cont = document.createElement('div')
      let button = document.createElement('button')
      let xButton = document.createElement('button')

      button.type = 'button'
      xButton.type = 'button'

      button.innerHTML = board.name
      xButton.innerHTML = 'X'
      xButton.classList.add('delete')
      cont.classList.add('button-cont')
      xButton.addEventListener('click', () => {
        this.deleteBoardHandler(board.name)
      })

      button.addEventListener('click', async () => {
        let notes = []
        this.setState({ notes })
        await this.forceUpdate()
        notes = [...board.notes]
        this.setState({ notes })
        document.querySelector('.save-board-input').value = board.name
        parentMenuCont.style.display = 'none'
      })
      cont.appendChild(xButton)
      cont.appendChild(button)

      newMenu.appendChild(cont)
    })
    parentMenuCont.appendChild(newMenu)
  }

  reRender = async () => {
    let notes = this.state.initialArray
    document.querySelector('.save-board-input').value = ''
    document.querySelector('.board-drop').style.display = 'none'
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
            zHigh={this.zIndexFinder}
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
