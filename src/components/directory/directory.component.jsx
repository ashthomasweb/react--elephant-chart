import React, { Component } from "react";

import logo from '../../assets/flow-post-logo.png'
import CustomButton from "../custom-button/custom-button.component";
import NoteItem from "../note-item/note-item.component";

import "./directory.styles.scss";

class Directory extends Component {
  constructor() {
    super();

    this.state = {
      currentDrag: {},
      notes: [
        {
          id: 1,
          top: '',
          left: '',
          imageUrl: logo,
          mouseOffsetX: 0,
          mouseOffsetY: 0
        },
        {
          id: 2,
          top: '',
          left: '350px',
          imageUrl: logo,
          mouseOffsetX: 0,
          mouseOffsetY: 0
        },
      ]
    };

    this.dave = this.tester.bind(this)
  }

  tester = (input) => {
    this.setState( { currentDrag: input })
    var newNote = { ...this.state.currentDrag }
    var newIndex = newNote.id - 1
    var notes = [...this.state.notes]
    notes[newIndex] = newNote
    this.setState({ notes })
  }
  
  dropHandler = (e) => {
    this.tester()
    // database storage for board persistence
  }

  render() {
    return (
      <div 
      className="directory-menu"
      onDragOver={(e) => e.preventDefault()}
      onDrop={this.dropHandler}
      >
          { this.state.notes.map(({ id, ...sectionProps }) => (
              <NoteItem key={id} dave={this.tester} value={id} { ...sectionProps}/>
          )) }    
      <CustomButton 
      style={{ bottom: '50px', position: 'absolute' }}
      onClick={() => console.log(this.state)}>
      Log Notes State
    </CustomButton>
    <CustomButton 
      style={{ bottom: '50px', left: '300px', position: 'absolute' }}
      onClick={() => console.log(this.state.currentDrag)}>
      Log CurrentDrag State
    </CustomButton>
      </div>
      )
  }
}

export default Directory
