
import React from 'react'
import { observer } from 'mobx-react'

class Summary extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  // maxResults (advOptions) {
  //   return advOptions ? `Results limited to a maximum of ${this.store.maxResults} rows` : ''
  // }

  capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render () {
    const reportSuite = this.store.reportSuite.selectionName
    const startDate = this.store.startDatePicker
    const endDate = this.store.endDatePicker
    const granularity = this.capitalize(this.store.granularity.selection)
    const metric1 = this.store.metric1.selectionName
    const metric2 = this.store.metric2.selectionName
    const metric3 = this.store.metric3.selectionName
    const metric4 = this.store.metric4.selectionName
    const metric5 = this.store.metric5.selectionName
    const metrics = [metric1, metric2, metric3, metric4, metric5]

    const elementPrimary = this.store.elementPrimary.selectionName
    const topPrimary = this.store.topPrimary
    const startingWithPrimary = this.store.startingWithPrimary
    const elementSecondary = this.store.elementSecondary.selectionName
    const topSecondary = this.store.topSecondary
    const startingWithSecondary = this.store.startingWithSecondary
    const elementTertiary = this.store.elementTertiary.selectionName
    const topTertiary = this.store.topTertiary
    const startingWithTertiary = this.store.startingWithTertiary
    const elements = [elementPrimary, elementSecondary, elementTertiary]
    const elementLabels = ["Primary", "Secondary", "Tertiary"]

    const segment1 = this.store.segment1.selectionName
    const segment2 = this.store.segment2.selectionName
    const segments = [segment1, segment2]
    // const advOptions = this.store.advOptions
    // const maxResults = this.maxResults(advOptions)
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
          <a href="javascript:setPage('#reportSuite')">Selected Report Suite</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>Report Suite:</th>
                <th style={thStyle}>{reportSuite}</th>
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
              {
                granularity ?
                    <tr>
                      <th style={thNarrowStyle}>Granularity:</th>
                      <th style={thStyle}>{granularity}</th>
                    </tr> :
                    null
              }
            </tbody>
          </table>
        </div>
        <br></br>
        {/* Metrics - use .reduce to create and return an array of present
          values with correct index reference */}
        <div>
          <a href="javascript:setPage('#metricSelectors')">Selected Metrics</a>
                <table style={tableStyle}>
                  <tbody>
                    {
                      metrics.reduce((acc, value, index) => {
                        if (value) {
                          acc.push(
                            <tr key={value}>
                              <th style={thNarrowStyle}>Metric {index+1}:</th>
                              <th style={thStyle}>{value}</th>
                            </tr>
                          )
                          return acc
                        } else {
                          return acc
                        }
                      }, [])
                    }
            </tbody>
          </table>
        </div>
        <br></br>
        {/* Elements */}
        <div>
          <a href="javascript:setPage('#elementSelectors')">Selected Elements</a>
          <table style={tableStyle}>
            <tbody>
              {
                elements.reduce((acc, value, index) => {
                  if (value) {
                    acc.push(
                      <tr key={value}>
                        <th style={thNarrowStyle}>{elementLabels[index]} Element:</th>
                        <th style={thStyle}>{value}</th>
                      </tr>
                    )
                    return acc
                  } else {
                    return acc
                  }
                }, [])
              }
            </tbody>
          </table>
        </div>
        <br></br>
        {/* Segments */}
        <div>
          <a href="javascript:setPage('#segmentSelectors')">Selected Segments</a>
          <table style={tableStyle}>
            <tbody>
              {
                segments.reduce((acc, value, index) => {
                  if (value) {
                    acc.push(
                      <tr key={value}>
                        <th style={thNarrowStyle}>Segment {index+1}:</th>
                        <th style={thStyle}>{value}</th>
                      </tr>
                    )
                    return acc
                  } else {
                    return acc
                  }
                }, [])
              }
            </tbody>
          </table>
        </div>
        <br></br>
          {/* {maxResults} */}
      </div>
    )
  }
}
export default observer(Summary)
