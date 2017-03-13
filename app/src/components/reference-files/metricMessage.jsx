import React from 'react'
import { observer } from 'mobx-react'

class MetricMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  render () {
    const metrics = this.store.metricsList.selectedValues
    const goals = this.store.metricsGoalsList.selectedValues
    const total = this.store.totalMetricsAndGoals

    return (
      <div>
        <div className='selectionMessage-outer'>Selected Metrics and Goals ({total}/10)  :
          <div className='selectionMessage-inner'>
            {
              // onClick={() => this.clicked(idx)}
              metrics.map((selection, idx) => <p className='selectionMessage-btn' key={idx}>{selection}</p>)
            }
          </div>
          <div className='selectionMessage-inner'>
            {
              goals.map((selection, idx) => <p className='goalSelectionMessage-btn' key={idx}>{selection}</p>)
            }
          </div>
        </div>
      </div>
    )
  }
}
export default observer(MetricMessage)
