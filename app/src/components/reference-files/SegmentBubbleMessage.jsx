import React from 'react'
import { observer } from 'mobx-react'

class SegmentBubbleMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (total, loading) {
    if (loading) {
      return 'bubbleWarning'
    } else {
      return total > 4 ? 'bubbleWarning' : ''
    }
  }

  messageText (total, loading) {
    let text
    if (loading) {
      text = 'Fetching menu options from the Google API'
    } else if (total > 4) {
      text = 'Maximum of 4 segments may be selected'
    } else {
      text = ''
    };

    return text
  }

  render () {
    const total = this.store.totalSegments
    const loading = this.store.segmentsList.loading
    const text = this.messageText(total, loading)
    const divClass = this.addClass(total, loading)

    return (
      <div id='segmentWarning' className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(SegmentBubbleMessage)
