import React from 'react'
import { Link } from 'react-router'

import NavBar from './NavBar'
import Footer from './Footer'

const Home = props => (
  <div>
    <div className="row">
    <NavBar />
    {props.children}
    <Footer />
    </div>
  </div>
)

export default Home