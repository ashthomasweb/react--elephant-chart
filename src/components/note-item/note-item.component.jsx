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
    }
  }

  mouseOffset = (e) => {
    const mouseOffsetY = e.pageY - parseFloat(getComputedStyle(e.target).top)
    const mouseOffsetX = e.pageX - parseFloat(getComputedStyle(e.target).left)
    this.setState({ mouseOffsetY, mouseOffsetX })
  }

  // sets current position of dragged note to Note Component's state, makes it immediately accesible with anon callback.
  dragHandler = (ev) => {
    let xValue = ev.clientX - this.state.mouseOffsetX + 'px'
    let yValue = ev.clientY - this.state.mouseOffsetY + 'px'

    if (ev.clientX !== 0) {
      this.setState( 
        {
          left: xValue,
          top: yValue,
          id: this.props.value,
        },
        () => {
          this.props.dave(this.state)
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
    this.setState(
      {
        width: getComputedStyle(e.target).getPropertyValue('width'),
        height: getComputedStyle(e.target).getPropertyValue('height')
      },
      () => {console.log(this.state); this.props.hal(this.state)}
    )
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
        }}
        className={`${size} menu-item`}
        onMouseDown={this.mouseOffset}
        onMouseUp={this.resizeHandler}
        onDrag={this.dragHandler}
        id={value}
        draggable>
        <div className='content'>
          <p className='note-text'>{noteText}</p>
        </div>
      </div>
    )
  }
}

export default NoteItem
