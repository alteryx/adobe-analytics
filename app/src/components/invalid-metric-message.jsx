import React from 'react'
import { observer } from 'mobx-react'

class InvalidMetric extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (type) {
    let divClass = ''

    if (type === '' || type === undefined) {
      divClass = ''
    } else if (type === 'Success') {
      divClass = 'metricValid'
    } else {
      divClass = 'metricWarning'
    }
    return divClass
  }

  addText (type, desc, metric) {
    let text = ''

    if (type === '' || type === undefined) {
      text = ''
    } else if (type === 'Success') {
      text = 'Success!  Valid combination of metrics.'
    } else {
      text = type + '\n\n' + desc + '\n\n' + metric
    }

    return text
  }

  render () {
    const errorType = this.store.metricError.error_type
    const errorDesc = this.store.metricError.error_description
    const metric = this.store.metricError.metricName
    const divClass = this.addClass(errorType)
    const text = this.addText(errorType, errorDesc, metric)

    return (
      <div className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(InvalidMetric)
