import React from 'react'
import { observer } from 'mobx-react'

class InvalidReport extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (type) {
    let divClass = ''

    if (type === '' || type === undefined) {
      divClass = ''
    } else if (type === 'Success') {
      divClass = 'validReport'
    } else {
      divClass = 'invalidReport'
    }
    return divClass
  }

  addText (type, desc) {
    let text = ''

    if (type === '' || type === undefined) {
      text = ''
    } else if (type === 'Success') {
      text = 'Success!  Valid report description.'
    } else {
      text = type + '\n\n' + desc
    }

    return text
  }

  render () {
    const errorType = this.store.reportValidation.error_type
    const errorDesc = this.store.reportValidation.error_description
    const divClass = this.addClass(errorType)
    const text = this.addText(errorType, errorDesc)

    return (
      <div className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(InvalidReport)
