import React from 'react'
import {Router, Route, IndexRedirect, hashHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import MigrationScatter from './components/migration-scatter'
import StateMap from './components/state-map'
import INaturalist from './components/inaturalist'
import Sunburst from './components/Sunburst'
import Home from './components/home'
import Landing from './components/landing'
const d3 = require('d3')

const onEnter = () => {
  console.log('called')
  d3.selectAll('svg').remove()
}

render(<Router history={hashHistory}>
        <Route path="/" component={Home} onEnter={onEnter} >
          <IndexRedirect to="/home" />
          <Route path="/home" component={Landing} onEnter={onEnter} />
          <Route path="/scatter" component={MigrationScatter} onEnter={onEnter} />
          <Route path="/state" component={StateMap} onEnter={onEnter} />
          <Route path="/inaturalist" component={INaturalist} onEnter={onEnter} />
          <Route path="/sunburst" component={Sunburst} onEnter={onEnter} />
        </Route>
       </Router>
       , document.getElementById('app'))
