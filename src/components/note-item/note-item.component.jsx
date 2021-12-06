import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import blank from '../../assets/trimmed-noborder.png'

import './note-item.styles.scss'

class NoteItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      width: this.props.width,
      height: this.props.height,
      top: '',
      left: '',
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

  clickHandler = (e) => {
    this.mouseOffset(e)
  }

  // sets current position of dragged note to Note Component's state, makes it immediately accesible with anon callback.
  dragHandler = (ev) => {
    let xValue = ev.clientX - this.state.mouseOffsetX + 'px'
    let yValue = ev.clientY - this.state.mouseOffsetY + 'px'

    console.log('1: ', ev.clientX)
    if (ev.clientX !== 0) {
      this.setState(
        {
          left: xValue,
          top: yValue,
          id: this.props.value,
        },
        () => {
          this.props.dave(this.state)
          console.log(this.state.left)
          console.log('2: ', ev.clientX)
        }
      )
    } else {
      // handles bad clientX value
      console.log(
        'clientX value error. Displaying previously known good position.'
      )
    }
  }

  resizeHandler = (e) => {
    this.setState(
      {
        width: getComputedStyle(e.target).getPropertyValue('width'),
        height: getComputedStyle(e.target).getPropertyValue('height')
      },
      () => this.props.hal(this.state)
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
      zIndex /*title,  history, linkUrl, match*/,
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
        onMouseDown={this.clickHandler}
        onDrag={this.dragHandler}
        // onDragEnd={(e) => e.preventDefault()}
        // onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        id={value}
        // onMouseUp={this.resizeHandler}
        draggable>
        <div className='content'>
          <p className='note-text'>{noteText}</p>
        </div>
      </div>
    )
  }
}

export default withRouter(NoteItem)
