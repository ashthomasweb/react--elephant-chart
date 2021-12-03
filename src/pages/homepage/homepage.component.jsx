import React from "react";

import "./homepage.styles.scss";

import Board from "../../components/board/board.component"
import Header from '../../components/header/header.component'

const HomePage = () => (
  <div className="homepage">
    <Header className='header' />
    <Board />
  </div>
);

export default HomePage;
