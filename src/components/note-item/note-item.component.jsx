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
    }

  }
  
  // sets current position of dragged note to Note Component's state, makes it immediately accesible with anon callback.
  dragHandler = (e) => {
    this.setState( { left: e.clientX + 'px', top: e.clientY + 'px', id: this.props.value }, () => this.props.dave(this.state) )
  }
  
  render() {
    const { value, imageUrl, size, left, top/*title,  history, linkUrl, match*/ } = this.props

    return (
        <div style={{ left: `${left}`, top: `${top}` }}
        // onClick={() => history.push(`${match.url}${linkUrl}`)}
          className={`${size} menu-item`}
          onDrag={this.dragHandler}
          id={value}
          draggable
          >
          <div
            className='background-image'
            style={{
              backgroundImage: `url(${imageUrl})`
            }}
          />
          {/* <div className='content'>
            <h1 className='title'>{title.toUpperCase()}</h1>
            <span className='subtitle'>SHOP</span>
          </div> */}
        </div>
    )
  }
}

export default withRouter(NoteItem)
