import React from 'react'
import { Link } from 'react-router'

import NavBar from './NavBar'

const Landing = props => (
  // <div className="container">
    <div className="jumbotron text-center">
      <h1 className="">biomaps</h1>
      <p className="">This is a description of this small application</p>
      <Link className="btn btn-default btn-lg" to="/scatter">
        Scatterplot
      </Link>

      <Link className="btn btn-default btn-lg" to="/state">
        Projection
      </Link>

      <Link className="btn btn-default btn-lg" to="/inaturalist">
        Treemap
      </Link>
    </div>
  // </div>
)

export default Landing