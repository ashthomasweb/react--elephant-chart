import React from "react"

import "./homepage.styles.scss"

import Board from "../../components/board/board.component"

const HomePage = (props) => (
  <div className="homepage">
    <Board currentUser={props.currentUser}/>
  </div>
)

export default HomePage
