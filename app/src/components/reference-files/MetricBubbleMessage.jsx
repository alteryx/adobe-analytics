import React from 'react'
import { observer } from 'mobx-react'

class MetricBubbleMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (total, loading) {
    if (loading) {
      return 'bubbleWarning'
    } else {
      return total < 1 || total > 10 ? 'bubbleWarning' : ''
    }
  }

  messageText (total, loading) {
    let text
    if (loading) {
      text = 'Fetching menu options from the Google API'
    }
    else if (total < 1) {
      text = 'At least 1 metric or goal must be selected'
    } else if (total > 10) {
      text = 'Maximum of 10 metrics and goals may be selected'
    } else {
      text = ''
    };

    return text
  }

  render () {
    const total = this.store.totalMetricsAndGoals
    const loading = this.store.metricsList.loading
    const text = this.messageText(total, loading)
    const divClass = this.addClass(total, loading)

    return (
      <div id='metricWarning' className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(MetricBubbleMessage)
