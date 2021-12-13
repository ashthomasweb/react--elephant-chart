import React, { Component } from 'react'

import CustomButton from '../custom-button/custom-button.component'
import NoteItem from '../note-item/note-item.component'
import Header from '../../components/header/header.component'

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
      initialArray: [
        {
          id: 1,
          width: '',
          height: '',
          top: '155px',
          left: '10px',
          zIndex: 0,
          imageUrl: blankYellow,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText:
            'You can double-click and update me! Recycle me in the corner!',
          border: 'none',
        },
        {
          id: 1,
          width: '',
          height: '',
          top: '155px',
          left: '270px',
          zIndex: 0,
          imageUrl: blankYellow,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText: 'Sign in with google or any email to save your boards!',
          border: 'none',
        },
      ],
      notes: [
        {
          id: 2,
          width: '',
          height: '',
          top: '155px',
          left: '10px',
          zIndex: 0,
          imageUrl: blankYellow,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText:
            'You can double-click and update me! Recycle me in the corner!',
          border: 'none',
        },
        {
          id: 1,
          width: '',
          height: '',
          top: '155px',
          left: '270px',
          zIndex: 0,
          imageUrl: blankYellow,
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          noteText: 'Sign in with google or any email to save your boards!',
          border: 'none',
        },
      ],
    }

    // not needed, anymore or ever?
    this.positionUpdater = this.positionUpdater.bind(this)
    // this.resizeHandler = this.resize.bind(this)
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
    final === false && this.trashBox(e)
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

  trashBox = (e) => {
    let xMax = e.view.innerWidth
    let yMax = e.view.innerHeight
    if (e.clientX > xMax - 250 && e.clientY > yMax - 250) {
      console.log('hi dave')
      document.querySelector('.trash-frame').classList.add('hovered')
    } else {
      document.querySelector('.trash-frame').classList.remove('hovered')
    }
  }

  trashHandler = (e) => {
    let notes = [...this.state.notes]
    let deleteId = e.target.id
    let xMax = e.view.innerWidth
    let yMax = e.view.innerHeight
    if (e.clientX > xMax - 250 && e.clientY > yMax - 250) {
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === Number(deleteId)) {
          notes.splice(i, 1)
        }
      }
    }
    this.setState({ notes })
  }

  dropHandler = (e) => {
    this.positionUpdater(null, e, true)
    this.trashHandler(e)
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
      parseFloat(getComputedStyle(el).getPropertyValue('left')) - 340 + 'px'
    newNote.top =
      parseFloat(getComputedStyle(el).getPropertyValue('top')) + 120 + 'px'
    notes.push(newNote)
    this.setState({ notes })
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
    upNote.id = id
    notes[newIndex] = upNote
    this.setState({ notes })
    this.cancelUpdate()
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
    // change compose area title
    // no title yet to change!

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

  reRender = async () => {
    let notes = this.state.initialArray
    await this.forceUpdate()
    this.setState({ notes })
    // handle compose frame display
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
