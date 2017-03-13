import React from 'react'
import { observer } from 'mobx-react'

const PropTypes = React.PropTypes

class DimensionMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  render () {
    const dimensions = this.store.dimensionsList.selectedValues
    const total = this.store.totalDimensions

    return (
      <div>
        <div className='selectionMessage-outer'>Selected Dimensions ({total}/7)  :
          <div className='selectionMessage-inner'>
            {
              // onClick={() => this.clicked(idx)}
              dimensions.map((selection, idx) => (<p className='selectionMessage-btn' key={idx}>{selection}</p>))
            }
          </div>
        </div>
      </div>
    )
  }
}

DimensionMessage.propTypes = {
  store: PropTypes.object
}

export default observer(DimensionMessage)
