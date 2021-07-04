import React from 'react'
import dispatcher from '../module/dispatcher'


class Cards extends React.Component {
  constructor () {
    super()
    const _events = (this._events = {})
    ;['onMouseDown', 'onMouseUp', 'onDragStart', 'onDragEnd', 'onDrag'].forEach(
      name => {
        _events[name] = this._handleEvent.bind(this)
      }
    )
  }

  

  _handleEvent (event) {
    const { text } = this.props
    const { type } = event
    const messageName = {
      mousedown: 'start',
      dragstart: 'start',
      drag: 'progress',
      mouseup: 'end',
      dragend: 'end'
    }[type]
    dispatcher.emit(`dnd:${messageName}`, text)
    switch (type) {
      case 'dragstart':
        event.dataTransfer.setData('text/plain', text)
        break
    }
  }

  render () {
    const { text } = this.props
    return (
      <div className='card' draggable='true' {...this._events}>
        <div className="card-title" style={{fontSize:'20px', background: 'rgb(224 122 177 / 67%)', color: 'white', paddingLeft : '10px'}}>
              Card details
        </div>
        <footer id='title'>
          <span style={{ background: 'blue', padding: '5px', borderRadius: '8%' }}>{text}</span>
        </footer>
      </div>
    )
  }
}



export default Cards