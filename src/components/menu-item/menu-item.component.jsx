import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// import "./menu-item.styles.scss";



import './menu-item.styles.scss'

class MenuItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      key: 'value'
    }


  }

  
  
  
  
  dragHandler = (e, id) => {
    // console.log(getComputedStyle(e.target).getPropertyValue('left'))
    console.log(id)
    e.dataTransfer.setData("text/plain", e.target.id)
  }
  render() {
    
    const { id, title, imageUrl, size, history, linkUrl, match } = this.props
    return (

      <div
      className={`${size} menu-item`}
      onClick={() => history.push(`${match.url}${linkUrl}`)}
      onDrag={(e) => this.dragHandler(e, id)}
      draggable
      >
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <div className="content">
        <h1 className="title">{title.toUpperCase()}</h1>
        <span className="subtitle">SHOP</span>
      </div>
    </div>
    )

  }

}

export default withRouter(MenuItem);


// const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => (
// );

