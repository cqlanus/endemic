import React from 'react'
import {Router, Route, IndexRedirect, hashHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import MigrationScatter from './components/migration-scatter'
import StateMap from './components/state-map'
import INaturalist from './components/inaturalist'
import Home from './components/home'

render(<Router history={hashHistory}>
        <Route path="/" component={Home} >
          <Route path="/scatter" component={MigrationScatter} />
          <Route path="/state" component={StateMap} />
          <Route path="/inaturlist" component={INaturalist} />
        </Route>
       </Router>
       , document.getElementById('app'))
