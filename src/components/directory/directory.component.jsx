import React, { Component } from "react";

import logo from '../../assets/flow-post-logo.png'

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
          test: 'field',
        },
        {
          id: 2,
          top: '50px',
          left: '350px',
          imageUrl: logo,
          test: 'it',
        },
      ]
    };

    this.dave = this.tester.bind(this)
  }

  tester = (input) => {
    // let temp = input.left
    // console.log(`Hi Dave, I'm ${input.left} ${input.top}`)
    this.setState( { currentDrag: input })
    
    // const updateNote = () => this.state.notes.find((note) => {
    //   console.log(this.state.notes.indexOf(note.id))
    //   return note.id === input.id
    // })

    // // this.setState( { })
    // console.log('update:', updateNote())
    
  }
  
  dropHandler = (e) => {
    console.log(this.state)
    console.log(this.state.currentDrag)
    // this.state.notes.forEach( (note) => {
    //   if (this.state.currentDrag.id === note.id) {
    //     this.setState( { notes[currentDrag.id].left: currentDrag.left })
    //   }
    // })

    var note = { ...this.state.currentDrag}
    var index = note.id - 1
    console.log(note)
    console.log(this.state.notes[1])
    console.log(index)
    this.setState({ notes[index]: note })
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
          { this.state.notes.map(({ id, ...sectionProps }) => (
              <NoteItem key={id} dave={this.tester} value={id} { ...sectionProps}/>
          )) }    
      </div>
      )
  }
}

export default Directory
