import React from 'react'
import { Link } from 'react-router'

import NavBar from './NavBar'

const Home = props => (
  <div>
    <div className="row">
    <NavBar />
    </div>
    {props.children}
  </div>
)

export default Home