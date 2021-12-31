import React, { Component } from 'react'

import check from '../../assets/check.png'

import './note-item.styles.scss'

class NoteItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: this.props.id,
      width: this.props.width,
      height: this.props.height,
      top: this.props.top,
      left: this.props.left,
      zIndex: this.props.zHigh(),
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      noteText: this.props.noteText,
      border: this.props.border,
      noteBColor: this.props.noteBColor,
      isMatBoard: this.props.isMatBoard,
      matOffsetX: this.props.matOffsetX ?? 0,
      matOffsetY: this.props.matOffsetY ?? 0,
      noteGroup: this.props.noteGroup,
      isChecked: this.props.isChecked,
    }
  }

  clickHandler = (e) => {
    if ( this.state.isMatBoard ) this.props.findMatGroup(e.target.id)
    this.mouseOffset(e)
    if (document.querySelector('#check-toggle').checked === true) {
      this.props.checkHandler(!this.state.isChecked, e.target.id)
      let isChecked = !this.state.isChecked
      this.setState({ isChecked })
    }
  }

  mouseOffset = (e) => {
    const mouseOffsetY = e.clientY - parseFloat(getComputedStyle(e.target).top)
    const mouseOffsetX = e.clientX - parseFloat(getComputedStyle(e.target).left)
    this.setState({ mouseOffsetY, mouseOffsetX })
  }

  // sets current position of dragged note to Note Component's state for skewmorphic effect
  dragHandler = (ev) => {
    let xValue = `${ev.clientX - this.state.mouseOffsetX}px`
    let yValue = `${ev.clientY - this.state.mouseOffsetY}px`
    let width = this.props.width
    let height = this.props.height
    let border = this.props.border ?? 'none'
    let color = this.props.noteBColor ?? '#f2ecb3'
    let isChecked = this.props.isChecked ?? false
    let isMatBoard = this.props.isMatBoard ?? false
    let noteGroup = this.props.noteGroup ?? []

    if (ev.clientX !== 0) {
      this.setState(
        {
          left: xValue,
          top: yValue,
          id: this.props.id,
          width: width,
          height: height,
          noteText: this.props.noteText,
          border: border,
          noteBColor: color,
          isChecked: isChecked,
          isMatBoard: isMatBoard,
          noteGroup: noteGroup
        },
        () => {
          if ( isMatBoard ) {
            let matPack = [this.state.id, noteGroup, ev]
            this.props.positionUpdater(this.state, ev, false, matPack)
          } else {
            this.props.positionUpdater(this.state, ev)
          }
        }
      )
    } else {
      // handles remaining bad clientX value
      console.log(
        'ERROR: dragend/dragover clientX value error. Displaying previously known good position. Error occurs during fast clicking of notes due to client not having time to update. No notes were lost.'
      )
    }
  }

  resizeHandler = (e) => {
    let width = getComputedStyle(e.target).getPropertyValue('width')
    let height = getComputedStyle(e.target).getPropertyValue('height')
    let id = this.state.id
    this.props.resizeHandler(id, width, height)
    this.setState({
      width: width,
      height: height,
    })
  }

  editHandler = () => {
    this.props.edit(this.state.id)
  }

  displayHandler = () => {
    if (this.props.id <= 4 && this.props.initialDisplay === false) {
      return 'none'
    } else {
      return 'block'
    }
  }

  render() {
    const {
      id,
      width,
      height,
      left,
      top,
      noteText,
      zIndex,
      border,
      noteBColor,
      isMatBoard
    } = this.props

    return (
      <div
        style={{
          width: `${width}`,
          height: `${height}`,
          left: `${left}`,
          top: `${top}`,
          backgroundColor: `${noteBColor ?? '#f2ecb3'}`,
          zIndex: `${zIndex}`,
          border: `${border}`,
          display: this.displayHandler(),
        }}
        id={id}
        className={`note-comp`}
        onMouseDown={this.clickHandler}
        onMouseUp={this.resizeHandler}
        onDrag={this.dragHandler}
        onDoubleClick={this.editHandler}
        draggable>
        <div className={`content isMat-${isMatBoard}`}>
          <img
            src={check}
            style={{ display: `${this.props.isChecked ? 'block' : 'none'}` }}
            className='note-check'
            alt='checkmark'
          />
          <p className='note-text'>{noteText}</p>
        </div>
      </div>
    )
  }
}

export default NoteItem
