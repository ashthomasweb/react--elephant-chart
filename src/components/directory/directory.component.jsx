import React, { Component } from "react";

import logo from '../../assets/flow-post-logo.png'

import NoteItem from "../note-item/note-item.component";

import "./directory.styles.scss";

class Directory extends Component {
  constructor() {
    super();

    this.state = {
      sections: [
        {
          top: '',
          left: '',
          title: "hats",
          imageUrl: logo,
          id: 1,
          linkUrl: "hats",
        },
      ],
      currentDrag: {}
    };

    this.dave = this.tester.bind(this)
  }

  tester = (input) => {
    console.log(`Hi Dave, I'm ${input.left} ${input.top}`)
    this.setState( { currentDrag: input })
  }
  
  dropHandler = (e) => {
    console.log(this.state)
    // identify the correct note and update info
    // get coords from state
    // database storage for board persistence
  }

  render() {
    return (
      <div 
      className="directory-menu"
      onDragOver={(e) => e.preventDefault()}
      onDrop={this.dropHandler}
      >
          { this.state.sections.map(({ id, ...sectionProps }) => (
              <NoteItem key={id} dave={this.tester} value={id} { ...sectionProps}/>
          )) }    
      </div>
      )
  }
}

export default Directory
