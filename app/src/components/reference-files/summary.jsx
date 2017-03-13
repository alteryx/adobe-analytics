
import React from 'react'
import { observer } from 'mobx-react'

class Summary extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  maxResults (advOptions) {
    return advOptions ? `Results limited to a maximum of ${this.store.maxResults} rows` : ''
  }

  render () {
    const account = this.store.accountsList.selectionName
    const webProperty = this.store.webPropertiesList.selectionName
    const profile = this.store.profilesList.selectionName
    const startDate = this.store.startDatePicker
    const endDate = this.store.endDatePicker
    const metrics = this.store.metricsList.selectedValues
    const metricGoals = this.store.metricsGoalsList.selectedValues
    const dimensions = this.store.dimensionsList.selectedValues
    const segments = this.store.segmentsList.selectedValues
    const advOptions = this.store.advOptions
    const maxResults = this.maxResults(advOptions)
    const divClass = 'summary'
    const tableStyle = {
      width: '95%'
    }
    const thNarrowStyle = {
      width: '25%'
    }
    const thStyle = {
      width: '60%'
    }
    return (
      <div className={divClass}>
        <div>
          <a href="javascript:setPage('#profileSelectors')">Selected Account Details</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>Account:</th>
                <th style={thStyle}>{account}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>WebProperty:</th>
                <th style={thStyle}>{webProperty}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>Profile:</th>
                <th style={thStyle}>{profile}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#datePickers')">Selected Date</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>Start Date:</th>
                <th style={thStyle}>{startDate}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>End Date:</th>
                <th style={thStyle}>{endDate}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#metrics')">Selected Metrics and Goals</a>
          <div>
            <table>
              <tbody>
                {
                  metrics.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
                }
                {
                  metricGoals.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#dimensions')">Selected Dimensions</a>
          <div>
            <table>
              <tbody>
                {
                  dimensions.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#segments')">Selected Segments</a>
          <div>
            <table>
              <tbody>
                {
                  segments.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <br></br>
          {maxResults}
        </div>
      </div>
    )
  }
}
export default observer(Summary)
