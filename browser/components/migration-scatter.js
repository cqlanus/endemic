import React from 'react'
import migrationScatter from '../../migrationScatter'
import ebird from '../../data/ebird-simple.json'

class MigrationScatter extends React.Component {
  constructor() {
    super()
    this.state = {
      bird: 'Mniotilta varia',
      byTime: 'true',
      byCount: 'false'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    console.log(this.state)
    migrationScatter(this.state)
  }
  render() {
    return (
      <div id='migration' className="row">
        <form className="form-inline form-flex" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-xs-5 col-form-label" htmlFor="bird">Select a bird: </label>
            <div className="col-xs-7">
              <input autoFocus className="form-control" name="bird" type="text" onChange={this.handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label" htmlFor="byTime">X Axis: </label>
            <div className="col-xs-7">
            <select className="form-control" name="byTime" onChange={this.handleChange}>
              <option value='true'>Last 30 Days</option>
              <option value='false'>Longitude</option>
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
// migrationScatter({
//   bird: 'Mniotilta varia',
//   byTime: false
// })

export default MigrationScatter