import React from 'react'
import { observer } from 'mobx-react'

class InvalidSegment extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (type) {
    let divClass = ''

    if (type === '' || type === undefined) {
      divClass = ''
    } else if (type === 'Success') {
      divClass = 'segmentValid'
    } else {
      divClass = 'segmentWarning'
    }
    return divClass
  }

  addText (type, desc, segment) {
    let text = ''

    if (type === '' || type === undefined) {
      text = ''
    } else if (type === 'Success') {
      text = 'Success!  Valid combination of segments.'
    } else {
      text = type + '\n\n' + desc + '\n\n' + segment
    }

    return text
  }

  render () {
    const errorType = this.store.segmentError.error_type
    const errorDesc = this.store.segmentError.error_description
    const segment = this.store.segmentError.segmentName
    const divClass = this.addClass(errorType)
    const text = this.addText(errorType, errorDesc, segment)

    return (
      <div className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(InvalidSegment)
