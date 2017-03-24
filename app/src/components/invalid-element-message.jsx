import React from 'react'
import { observer } from 'mobx-react'

class InvalidElement extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (type) {
    return type === '' || type === undefined ? '' : 'elementWarning'
  }

  addText (type, desc, element) {
    const text = type + '\n\n' + desc + '\n\n' + element
    return type === '' || type === undefined ? '' : text
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
