import React, { Component } from 'react'

import check from '../../assets/check.png'

import './note-item.styles.scss'

class NoteItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMatBoard: this.props.isMatBoard,
      isChecked: this.props.isChecked,
      id: this.props.id,
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

  dragHandler = (e) => {
    const p = this.props
    const s = this.state
    const { width, height } = p
    let xValue = `${e.clientX - s.mouseOffsetX}px`
    let yValue = `${e.clientY - s.mouseOffsetY}px`
    // handling of undefined db values set before feature implementation
    let border = p.border ?? 'none'
    let color = p.noteBColor ?? '#f2ecb3'
    let noteGroup = p.noteGroup ?? []
    let isChecked = p.isChecked ?? false
    let isMatBoard = s.isMatBoard ?? false
    let pUpdate = p.positionUpdater

    if (e.clientX !== 0) {
      this.setState(
        {
          left: xValue,
          top: yValue,
          width: width,
          height: height,
          noteText: p.noteText,
          border: border,
          noteBColor: color,
          isChecked: isChecked,
          isMatBoard: isMatBoard,
          noteGroup: noteGroup
        },
        () => isMatBoard ? pUpdate(this.state, e, false, [this.state.id, noteGroup, e]) : pUpdate(this.state, e)
      )
    } else { // handles remaining bad clientX value
      console.log(
        'ERROR: dragend/dragover clientX value error. Displaying previously known good position. Error occurs during fast clicking of notes due to client not having time to update. No notes were lost.'
      )
    }
  }

  resizeHandler = (e) => {
    let width = getComputedStyle(e.target).getPropertyValue('width')
    let height = getComputedStyle(e.target).getPropertyValue('height')
    this.props.resizeHandler(this.state.id, width, height)
    this.setState({
      width: width,
      height: height,
    })
  }

  editHandler = () => {
    this.props.edit(this.state.id)
  }

  displayHandler = () => {
    if (this.state.id <= 4 && this.props.initialDisplay === false) {
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
