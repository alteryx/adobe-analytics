import React from 'react'
import { observer } from 'mobx-react'

class InvalidMetric extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
    this.errorText = props.errorText
    this.errorDescription = props.errorDescription
  }

  mapName (store, errorDescription) {
    const metricArray = [
      store.metric1,
      store.metric2,
      store.metric3,
      store.metric4,
      store.metric5
    ]

    console.log(store.metric1.selectionName)
  }

  render () {
    const store = this.store
    const desc = this.errorDescription
    const metricName = this.mapName(store, desc)
    return (
      <div>
        <p>{this.errorText}</p>
        <p>{this.errorDescription}</p>
        <p>{this.metricName}</p>
      </div>
    )
  }
}
export default observer(InvalidMetric)
