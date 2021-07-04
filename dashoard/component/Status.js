import React from 'react'
import Card from './Card'
import dispatcher from '../module/dispatcher'

class Status extends React.Component {
  constructor () {
    super()
    const _events = (this._events = {})
    ;['onDragOver', 'onDrop'].forEach(name => {
      _events[name] = this._handleEvent.bind(this)
    })
  }

  render () {
    const { label, cards = [] } = this.props
    return (
      <div className='area' {...this._events}>
        <div className='area__label'>{label}</div>
        {cards.map((text, idx) => (
          <Card key={idx} text={text} />
        ))}
      </div>
    )
  }

  _handleEvent (event) {
    const { label } = this.props
    const { type } = event
    event.preventDefault()

    if (type === 'dragover') {
      return
    }

    const messageName = {
      drop: 'drop'
    }[type]

    let text
    try {
      text = event.dataTransfer.getData('text')
    } catch (e) {
      return
    }
    if (text) {
      dispatcher.emit(`dnd:${messageName}`, { label, text })
    }
  }
}


export default Status;
