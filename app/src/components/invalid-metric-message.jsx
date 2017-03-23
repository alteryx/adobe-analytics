import React from 'react'
import { observer } from 'mobx-react'

class InvalidMetric extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (type) {
    return type === '' || type === undefined ? '' : 'metricWarning'
  }

  addText (type, desc, metric) {
    const text = type + '\n\n' + desc + '\n\n' + metric
    return type === '' || type === undefined ? '' : text
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
