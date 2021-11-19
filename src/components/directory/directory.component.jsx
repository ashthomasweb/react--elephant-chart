import React, { Component } from "react";

import MenuItem from "../menu-item/menu-item.component";

import "./directory.styles.scss";

class Directory extends Component {
  constructor() {
    super();

    this.state = {
      sections: [
        {
          title: "hats",
          imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
          id: 1,
          linkUrl: "hats",
        },
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
      ],
    };
  }

  dropHandler = (ev) => {
    ev.preventDefault()
    const data = ev.dataTransfer.getData('id')

    console.log(data, 'from drop')
    ev.dataTransfer.clearData()
  }

  render() {
    return (
      <div 
      className="directory-menu"
      onDrop={(e) => this.dropHandler(e)}
      onDragOver={(e) => e.preventDefault()}
      >
          { this.state.sections.map(({ id, ...sectionProps }) => (
              <MenuItem key={id} {...sectionProps}/>
          )) }    
      </div>
      )
  }
}

export default Directory
