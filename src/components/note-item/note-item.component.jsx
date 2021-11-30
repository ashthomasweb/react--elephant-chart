import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logo from '../../assets/flow-post-logo.png'

import './note-item.styles.scss'

class NoteItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      top: '',
      left: '',
      imageUrl: logo,
      mouseOffsetX: 0,
      mouseOffsetY: 0
    }

  }
  
  mouseOffset = (e) => {
    const mouseOffsetY = e.pageY - parseFloat(getComputedStyle(e.target).top)
    const mouseOffsetX = e.pageX - parseFloat(getComputedStyle(e.target).left)
    this.setState({mouseOffsetY, mouseOffsetX}, () => this.props.dave(this.state))
  }
  
  // sets current position of dragged note to Note Component's state, makes it immediately accesible with anon callback.
  dragHandler = (e) => {
    this.setState( { left: e.clientX - this.state.mouseOffsetX + 'px', top: e.clientY - this.state.mouseOffsetY + 'px', id: this.props.value }, () => this.props.dave(this.state) )
  }
  
  render() {
    const { value, imageUrl, size, left, top/*title,  history, linkUrl, match*/ } = this.props

    return (
        <div style={{ left: `${left}`, top: `${top}`, backgroundImage: `url(${imageUrl})` }}
          className={`${size} menu-item`}
          onMouseDown={this.mouseOffset}
          onDrag={this.dragHandler}
          id={value}
          draggable
          >
          {/* <div className='content'>
            <h1 className='title'>{title.toUpperCase()}</h1>
            <span className='subtitle'>SHOP</span>
          </div> */}
        </div>
    )
  }
}

export default withRouter(NoteItem)
