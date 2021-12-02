import React from "react";

import "./homepage.styles.scss";

import Directory from "../../components/directory/directory.component"
import Header from '../../components/header/header.component'

const HomePage = () => (
  <div className="homepage">
    <Header className='header' />

    <Directory />
  </div>
);

export default HomePage;
