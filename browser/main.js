import React from 'react'
// import {Router, Route, IndexRedirect, hashHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import Migration from './migration'

render(<Migration />, document.getElementById('app'))
