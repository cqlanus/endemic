import React from 'react'
import migrationScatter from '../migrationScatter'
import ebird from '../data/ebird-simple.json'

class Migration extends React.Component {
  constructor() {
    super()
    this.state = {
      bird: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(evt) {
    this.setState({
      bird: evt.target.value
    })
  }
  handleSubmit(evt) {
    evt.preventDefault()
    migrationScatter(this.state.bird)
  }
  render() {
    return (
      <div id='migration'>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="bird">Select a bird: </label>
          <select name="bird" onChange={this.handleChange}>
          {
            ebird.map((bird, i) => (
              <option key={i} value={bird.sciName}>{bird.comName}</option>
           ))
          }
          </select>
          <label>Type a bird</label>
          <input type="text" onChange={this.handleChange} />
          <button type='submit'>Search</button>
        </form>
      </div>
    )

  }
}
migrationScatter('Mniotilta varia')

export default Migration