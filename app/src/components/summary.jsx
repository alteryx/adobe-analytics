
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
  // reportSuiteFilter () {
  //   const stringList = this.store.reportSuite.stringList
  //   const selection = this.store.reportSuite.selection
  //   return stringList.filter((d) => {
  //     console.log(d.dataName)
  //     return selection === d.dataName
  //   })
  // }

  render () {
    // const reportSuite = this.reportSuiteFilter() //this.store.reportSuite.selectedValues
    const startDate = this.store.startDatePicker
    const endDate = this.store.endDatePicker
    const granularity = this.store.granularity.selection
    const metric1 = this.store.metric1.selectionName
    const metric2 = this.store.metric2.selectionName
    const metric3 = this.store.metric3.selectionName
    const metric4 = this.store.metric4.selectionName
    const metric5 = this.store.metric5.selectionName
    const elementPrimary = this.store.elementPrimary.selectionName
    const elementSecondary = this.store.elementSecondary.selectionName
    const elementTertiary = this.store.elementTertiary.selectionName
    // Add these when segments is done
    // const segment1 = this.store.segment1.selectionName
    // const segment2 = this.store.segment2.selectionName
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
        {/* <div>
          <a href="javascript:setPage('#reportSuite')">Selected Report Suite</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>Report Suite:</th>
                <th style={thStyle}>{reportSuite}</th>
              </tr>
            </tbody>
          </table>
        </div> */}
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
              <tr>
                <th style={thNarrowStyle}>Granularity:</th>
                <th style={thStyle}>{granularity}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#metricSelectors')">Selected Metrics</a>
                <table style={tableStyle}>
                  <tbody>
                    <tr>
                      <th style={thNarrowStyle}>Metric 1:</th>
                      <th style={thStyle}>{metric1}</th>
                     </tr>
                    <tr>
                      <th style={thNarrowStyle}>Metric 2:</th>
                      <th style={thStyle}>{metric2}</th>
                    </tr>
                    <tr>
                      <th style={thNarrowStyle}>Metric 3:</th>
                      <th style={thStyle}>{metric3}</th>
                    </tr>
                    <tr>
                      <th style={thNarrowStyle}>Metric 4:</th>
                      <th style={thStyle}>{metric4}</th>
                    </tr>
                    <tr>
                      <th style={thNarrowStyle}>Metric 5:</th>
                      <th style={thStyle}>{metric5}</th>
                    </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#elementSelectors')">Selected Elements</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>Primary Element:</th>
                <th style={thStyle}>{elementPrimary}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>Secondary Element:</th>
                <th style={thStyle}>{elementSecondary}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>Tertiary Element:</th>
                <th style={thStyle}>{elementTertiary}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        {/* <div>
          <a href="javascript:setPage('#segmentSelectors')">Selected Segments</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>Segment 1: </th>
                <th style={thStyle}>{segment1}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>Segment 2:</th>
                <th style={thStyle}>{segment2}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br> */}
          {/* {maxResults} */}
      </div>
    )
  }
}
export default observer(Summary)
