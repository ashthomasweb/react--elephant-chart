import React from "react"

import "./homepage.styles.scss"

import Board from "../../components/board/board.component"
import Header from '../../components/header/header.component'

const HomePage = (props) => (
  <div className="homepage">
    <Header className='header' currentUser={props.currentUser}/>
    <Board currentUser={props.currentUser}/>
  </div>
)

export default HomePage
