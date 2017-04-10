
import React from 'react'
import { observer } from 'mobx-react'

class Summary extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

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
    const metricLabels = ['XMSG("One")', 'XMSG("Two")', 'XMSG("Three")', 'XMSG("Four")', 'XMSG("Five")']

    const elementPrimary = this.store.elementPrimary.selectionName
    const advOptionsPrimary = this.store.advOptionsPrimary
    const elementPrimaryClassification = this.store.elementPrimaryClassification.selectionName
    const topPrimary = this.store.topPrimary
    const startingWithPrimary = this.store.startingWithPrimary
    const elementSecondary = this.store.elementSecondary.selectionName
    const advOptionsSecondary = this.store.advOptionsSecondary
    const elementSecondaryClassification = this.store.elementSecondaryClassification.selectionName
    const topSecondary = this.store.topSecondary
    const startingWithSecondary = this.store.startingWithSecondary
    const elementTertiary = this.store.elementTertiary.selectionName
    const advOptionsTertiary = this.store.advOptionsTertiary
    const elementTertiaryClassification = this.store.elementTertiaryClassification.selectionName
    const topTertiary = this.store.topTertiary
    const startingWithTertiary = this.store.startingWithTertiary
    const elements = [elementPrimary, elementSecondary, elementTertiary]
    const elementLabels = ['XMSG("Primary")', 'XMSG("Secondary")', 'XMSG("Tertiary")']
    const advOptionsList = [
      {
        isChecked: advOptionsPrimary,
        classification: elementPrimaryClassification,
        topRecordLimit: topPrimary,
        startingWith: startingWithPrimary
      },
      {
        isChecked: advOptionsSecondary,
        classification: elementSecondaryClassification,
        topRecordLimit: topSecondary,
        startingWith: startingWithSecondary
      },
      {
        isChecked: advOptionsTertiary,
        classification: elementTertiaryClassification,
        topRecordLimit: topTertiary,
        startingWith: startingWithTertiary
      }
    ]

    const segment1 = this.store.segment1.selectionName
    const segment2 = this.store.segment2.selectionName
    const segments = [segment1, segment2]
    const segmentLabels = ['XMSG("One")', 'XMSG("Two")']
    // React component conditionally renders pieces of information
    // based on inclusion of advanced options
    const ElementTableRow = (props) => {
      const {value, index} = props
      return advOptionsList[index].isChecked && advOptionsList[index].classification ?
        <tr>
          <th style={thNarrowStyle}>{elementLabels[index]}:</th>
          <th style={thStyle}>{value}</th>
          <th style={thNarrowStyle}>XMSG("Classification"):</th>
          <th style={thStyle}>{advOptionsList[index].classification}</th>
          <th style={thNarrowStyle}>XMSG("Record "):</th>
          <th style={thStyle}>{advOptionsList[index].topRecordLimit}</th>
          <th style={thNarrowStyle}>XMSG("Starting with Record"):</th>
          <th style={thStyle}>{advOptionsList[index].startingWith}</th>
        </tr>
      : advOptionsList[index].isChecked ?
        <tr>
          <th style={thNarrowStyle}>{elementLabels[index]}:</th>
          <th style={thStyle}>{value}</th>
          <th style={thNarrowStyle}>XMSG("Record Limit"):</th>
          <th style={thStyle}>{advOptionsList[index].topRecordLimit}</th>
          <th style={thNarrowStyle}>XMSG("Starting with Record"):</th>
          <th style={thStyle}>{advOptionsList[index].startingWith}</th>
        </tr>
        :
        <tr>
          <th style={thNarrowStyle}>{elementLabels[index]}:</th>
          <th style={thStyle}>{value}</th>
        </tr>
    }
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
          <a href="javascript:setPage('#reportSuite')">XMSG("Selected Report Suite")</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>XMSG("Report Suite"):</th>
                <th style={thStyle}>{reportSuite}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div>
          <a href="javascript:setPage('#datePickers')">XMSG("Selected Date")</a>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <th style={thNarrowStyle}>XMSG("Start Date"):</th>
                <th style={thStyle}>{startDate}</th>
              </tr>
              <tr>
                <th style={thNarrowStyle}>XMSG("End Date"):</th>
                <th style={thStyle}>{endDate}</th>
              </tr>
              {
                granularity ?
                    <tr>
                      <th style={thNarrowStyle}>XMSG("Granularity"):</th>
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
          <a href="javascript:setPage('#metricSelectors')">XMSG("Selected Metrics")</a>
                <table style={tableStyle}>
                  <tbody>
                    {
                      metrics.reduce((acc, value, index) => {
                        if (value) {
                          acc.push(
                            <tr key={`${value}${index}`}>
                              <th style={thNarrowStyle}>{metricLabels[index]}:</th>
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
          <a href="javascript:setPage('#elementSelectors')">XMSG("Selected Elements")</a>
          <table style={tableStyle}>
            <tbody>
              {
                elements.reduce((acc, value, index) => {
                  if (value) {
                    acc.push(
                      <ElementTableRow key={`${value}${index}`} value={value} index={index}/>
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
          <a href="javascript:setPage('#segmentSelectors')">XMSG("Selected Segments")</a>
          <table style={tableStyle}>
            <tbody>
              {
                segments.reduce((acc, value, index) => {
                  if (value) {
                    acc.push(
                      <tr key={`${value}${index}`}>
                        <th style={thNarrowStyle}>{segmentLabels[index]}:</th>
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
      </div>
    )
  }
}

export default observer(Summary)
