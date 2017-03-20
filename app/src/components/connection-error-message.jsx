import React from 'react'
import { observer } from 'mobx-react'

class ConnectionErrorMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (errorStatus, page) {
    if (page === '#developerCreds') {
      return errorStatus !== '' ? 'devConnectionWarning' : ''
    } else {
      return errorStatus !== '' ? 'userConnectionWarning' : ''
    }
  }

  messageText (errorStatus) {
    console.log('errorStatus:  ' + errorStatus)
    let text
    // The original error messages are commented right after the new messages
    switch (errorStatus) {
      case '':
        text = ''
        break
      case 1:
      case '1':
        text = 'Token has expired:  Please re-enter login credentials'
        break
      case 400:
      case '400':
        text = 'Reconfigure tool and try again' // '400 Bad Request Error:  Reconfigure tool and try again'
        break
      case 401:
      case '401':
        text = 'Enter valid Adobe Analytics credentials' // '401 Unauthorized Error:  Enter valid Google Analytics credentials'
        break
      case 503:
      case '503':
        text = 'Adobe Analytics API is unreachable, try again later' // '503 Service Unavailable Error:  Google API is unreachable, try again later'
        break
      default:
        text = 'Unable to reach API:  Reconfigure tool and try again'
    }

    return text
  }

  render () {
    const errorStatus = this.store.errorStatus
    const page = this.store.page
    const text = this.messageText(errorStatus)
    const divClass = this.addClass(errorStatus, page)

    return (
      <div className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(ConnectionErrorMessage)
