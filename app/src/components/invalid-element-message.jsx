import React from 'react'
import { observer } from 'mobx-react'

class InvalidElement extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (type) {
    let divClass = ''

    if (type === '' || type === undefined) {
      divClass = ''
    } else if (type === 'Success') {
      divClass = 'elementValid'
    } else {
      divClass = 'elementWarning'
    }
    return divClass
  }

  addText (type, desc, element) {
    let text = ''

    if (type === '' || type === undefined) {
      text = ''
    } else if (type === 'Success') {
      text = 'Success!  Valid combination of elements.'
    } else {
      text = type + '\n\n' + desc + '\n\n' + element
    }

    return text
  }
  render () {
    const errorType = this.store.elementError.error_type
    const errorDesc = this.store.elementError.error_description
    const element = this.store.elementError.elementName
    const divClass = this.addClass(errorType)
    const text = this.addText(errorType, errorDesc, element)

    return (
      <div className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(InvalidElement)
