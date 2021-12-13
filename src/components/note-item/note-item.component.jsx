import React, { Component } from 'react'
import blank from '../../assets/trimmed-noborder.png'

import './note-item.styles.scss'

class NoteItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: this.props.value,
      width: this.props.width,
      height: this.props.height,
      top: this.props.top,
      left: this.props.left,
      zIndex: this.props.zHigh(),
      imageUrl: blank,
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      noteText: this.props.noteText,
      border: this.props.border
    }
  }

  mouseOffset = (e) => {
    const mouseOffsetY = e.clientY - parseFloat(getComputedStyle(e.target).top)
    const mouseOffsetX = e.clientX - parseFloat(getComputedStyle(e.target).left)
    this.setState({ mouseOffsetY, mouseOffsetX })
  }

  // sets current position of dragged note to Note Component's state, makes it immediately accesible with anon callback.
  dragHandler = (ev) => {
    let xValue = ev.clientX - this.state.mouseOffsetX + 'px'
    let yValue = ev.clientY - this.state.mouseOffsetY + 'px'
    let width = this.state.width
    let height = this.state.height
    let border = this.props.border === undefined ? 'none' : this.props.border

    if (ev.clientX !== 0) {
      this.setState( 
        {
          left: xValue,
          top: yValue,
          id: this.props.value,
          width: width,
          height: height,
          noteText: this.props.noteText,
          border: border

        },
        () => {
          this.props.positionUpdater(this.state, ev)
        }
      )
    } else {
      // handles remaining bad clientX value
      console.log(
        'ERROR: dragend/dragover clientX value error. Displaying previously known good position. Error occurs during fast clicking of notes due to client not having time to update.'
      )
    }
  }

  resizeHandler = (e) => {
    let width = getComputedStyle(e.target).getPropertyValue('width')
    let height = getComputedStyle(e.target).getPropertyValue('height')
    let id = this.state.id
    this.props.resizeHandler(id, width, height)
    this.setState(
      {
        width: width,
        height: height
      }
    )
  }

  editHandler = (e) => {
    let id = this.state.id
    this.props.edit(id)
  }

  displayHandler = () => {
    if (this.props.value <= 2 && this.props.initialDisplay === false ) {
      return 'none'
    } else {
      return 'block'
    }
  }

  render() {
    const {
      value,
      imageUrl,
      size,
      width,
      height,
      left,
      top,
      noteText,
      zIndex,
      border
    } = this.props

    
    return (
      <div
        style={{
          width: `${width}`,
          height: `${height}`,
          left: `${left}`,
          top: `${top}`,
          backgroundImage: `url(${imageUrl})`,
          zIndex: `${zIndex}`,
          border: `${border}`,
          display: this.displayHandler()
        }}
        className={`${size} menu-item`}
        onMouseDown={this.mouseOffset}
        onMouseUp={this.resizeHandler}
        onDrag={this.dragHandler}
        onDoubleClick={this.editHandler}
        id={value}
        draggable>
        <div className='content'>
        
          <p className='note-text'  >{noteText}</p>
        </div>
      </div>
    )
  }
}

export default NoteItem
