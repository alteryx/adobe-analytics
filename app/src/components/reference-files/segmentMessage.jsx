import React from 'react'
import { observer } from 'mobx-react'

class SegmentMessage extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
  }

  render() {
    let segments = this.store.segmentsList.selectedValues
    let total = this.store.totalSegments

    return (
      <div>
        <div className='selectionMessage-outer'>Selected Segments ({total}/4) :
          <div className='selectionMessage-inner'>
            {
              // onClick={() => this.clicked(idx)}
              segments.map((selection, idx) => <p className='selectionMessage-btn' key={idx}>{selection}</p>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default observer(SegmentMessage);
