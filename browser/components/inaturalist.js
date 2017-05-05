import React from 'react'
import iNaturalistTreemap from '../../iNatData'
import iNatSunburstFn from '../../iNatSunburst'
import ebird_arr from '../../data/ebird-simple.json'
import state_lngs from '../../data/state_lngs.json'

class INaturalist extends React.Component {
  constructor() {
    super()
    this.state = {
      iconic_taxa: '',
      month: '',
      year: '',
      place_id: '1',
      filterBy: '',
      mapType: 'tree'
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
    if (this.state.mapType === 'tree') {
      iNaturalistTreemap(this.state)
    } else {
      iNatSunburstFn(this.state)
    }

  }

  render() {
    return (
      <div className="row">
        <form className="form-inline form-flex" onSubmit={this.handleSubmit}>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="place_id">State</label>
            <div className="col-xs-7">
              <select className="form-control" name="place_id" onChange={this.handleChange}>
                <option value='1'>All US</option>
                <option value='35'>IL</option>
                <option value='32'>WI</option>
                <option value='18'>TX</option>
                <option value='37'>MS</option>
                <option value='48'>NY</option>
                <option value='14'>CA</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="iconic_taxa">Taxa</label>
            <div className="col-xs-7">
              <select className="form-control" name="iconic_taxa" onChange={this.handleChange}>
                <option value=''>--</option>
                <option value='Animalia'>Animals</option>
                <option value='Actinopterygii'>Fish</option>
                <option value='Amphibia'>Amphibians</option>
                <option value='Aves'>Birds</option>
                <option value='Fungi'>Fungi</option>
                <option value='Insecta'>Insects</option>
                <option value='Arachnida'>Arachnids</option>
                <option value='Mammalia'>Mammals</option>
                <option value='Reptilia'>Reptiles</option>
                <option value='Plantae'>Plants</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="filterBy">Limit by</label>
            <div className="col-xs-7">
              <select className="form-control" name="filterBy" onChange={this.handleChange}>
                <option value=''>--</option>
                <option value='native'>Native species</option>
                <option value='endemic'>Endemic species</option>
                <option value='introduced'>Introduced species</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="year">Year</label>
            <div className="col-xs-7">
              <select className="form-control" name="year" onChange={this.handleChange}>
                <option value=''>--</option>
                <option value='2017'>2017</option>
                <option value='2016'>2016</option>
                <option value='2015'>2015</option>
                <option value='2014'>2014</option>
                <option value='2013'>2013</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="month">Month</label>
            <div className="col-xs-7">
              <select className="form-control" name="month" onChange={this.handleChange}>
                <option value=''>--</option>
                <option value='01'>Jan</option>
                <option value='02'>Feb</option>
                <option value='03'>Mar</option>
                <option value='04'>Apr</option>
                <option value='05'>May</option>
                <option value='06'>Jun</option>
                <option value='07'>Jul</option>
                <option value='08'>Aug</option>
                <option value='09'>Sep</option>
                <option value='10'>Oct</option>
                <option value='11'>Nov</option>
                <option value='12'>Dec</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xs-5 col-form-label-sm" htmlFor="mapType">Graph Type</label>
            <div className="col-xs-7">
              <select className="form-control" name="mapType" onChange={this.handleChange}>
                <option value='tree'>Treemap</option>
                <option value='sun'>Sunburst</option>

              </select>
            </div>
          </div>

          <button className="btn btn-default" type='submit'>Search</button>
        </form>
      </div>
    )
  }
}

export default INaturalist