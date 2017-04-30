import React from 'react'
import stateProjection from '../../stateProjection'
import stateProjectionAll from '../../stateProjectionAll'
import ebird_arr from '../../data/ebird-simple.json'
import state_lngs from '../../data/state_lngs.json'

class StateMap extends React.Component {
  constructor() {
    super()
    this.state = {
      species: 'Anas platyrhynchos',
      state: 'IL',
      byCount: 'false'
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    console.log(this.state)
    stateProjection(this.state)
  }

  render() {
    return (
      <div className="row">
        <form className="form-inline form-flex" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="species">Select a bird:</label>
            <div className="col-xs-7">
              <input autoFocus className="form-control input-xs" name="species" type="text" onChange={this.handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="state">State</label>
            <div className="col-xs-7">
              <select className="form-control" name="state" onChange={this.handleChange}>
                <option value='IL'>IL</option>
                <option value='WI'>WI</option>
                <option value='TX'>TX</option>
                <option value='MS'>MS</option>
                <option value='CA'>CA</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="byCount">Display</label>
            <div className="col-xs-7">
              <select className="form-control" name="byCount" onChange={this.handleChange}>
                <option value='false'>As single points</option>
                <option value='true'>By reported count</option>
              </select>
            </div>
          </div>

          <button className="btn btn-default" type='submit'>Search</button>
        </form>
      </div>
    )
  }
}

export default StateMap