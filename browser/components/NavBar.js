import React from 'react'
import { Link } from 'react-router'

const NavBar = () => (
  <nav className="navbar navbar-default">
      <div className="container">
          <div className="navbar-header">
              <Link className="navbar-brand" to="/home">biomaps</Link>
          </div>

          <div className="navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                  <li><Link to="/scatter">Migration Scatter</Link></li>
                  <li><Link to="/state">Map Projection</Link></li>
                  <li><Link to="/inaturalist">iNaturalist Treemaps</Link></li>
              </ul>
          </div>

      </div>
  </nav>
)

export default NavBar