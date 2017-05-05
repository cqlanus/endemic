import React from 'react'
import { Link } from 'react-router'

import NavBar from './NavBar'

const Landing = props => (
  // <div className="container">
    <div className="jumbotron text-center">
      <h1 className="">endemic</h1>
      <p className="">endemic uses the eBird and iNaturalist APIs to visualize biodiversity with d3.</p>
      <p className="">explore how data can come to <strong>life.</strong></p>
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