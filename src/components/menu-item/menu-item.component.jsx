import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

// import "./menu-item.styles.scss";

import './menu-item.styles.scss'

class MenuItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      left: '',
      top: '',
    }
  }
  
  dragHandler = (e) => {

    console.log(getComputedStyle(e.target))




    // console.log(getComputedStyle(e.target).getPropertyValue('left'))
    // console.log(data)
    // e.dataTransfer.setData('data', data)
  }

  
  render() {
    const { value, title, imageUrl, size,/* history, linkUrl, match*/ } = this.props

    return (
      
        <div
          className={`${size} menu-item`}
          // onClick={() => history.push(`${match.url}${linkUrl}`)}
          onDrag={(e) => this.dragHandler(e)}
          onDragOver={(e) => e.preventDefault()}
          // leftPos={ this.left }
          // TopPos={ this.top }

          id={value}
          draggable>
          <div
            className='background-image'
            style={{
              backgroundImage: `url(${imageUrl})`,
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

export default withRouter(MenuItem)

// const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => (
// );
