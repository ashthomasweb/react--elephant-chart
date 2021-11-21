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


    // console.log('test')
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










        // {
        //   title: "jackets",
        //   imageUrl: "https://i.ibb.co/px2tCc3/jackets.png",
        //   id: 2,
        //   linkUrl: "",
        // },
        // {
        //   title: "sneakers",
        //   imageUrl: "https://i.ibb.co/0jqHpnp/sneakers.png",
        //   id: 3,
        //   linkUrl: "",
        // },
        // {
        //   title: "womens",
        //   imageUrl: "https://i.ibb.co/GCCdy8t/womens.png",
        //   size: "large",
        //   id: 4,
        //   linkUrl: "",
        // },
        // {
        //   title: "mens",
        //   imageUrl: "https://i.ibb.co/R70vBrQ/men.png",
        //   size: "large",
        //   id: 5,
        //   linkUrl: "",
        // },
        // {
        //   title: "neutral",
        //   imageUrl: "https://www.ipsos.com/sites/default/files/ct/news_and_polls/2020-01/gender.jpg",
        //   size: "large",
        //   id: 6,
        //   linkUrl: "",
        // },