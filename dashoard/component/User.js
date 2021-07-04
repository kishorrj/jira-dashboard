
const dispatcher = new EventEmitter()

class Area extends React.Component {
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

class Card extends React.Component {
  constructor () {
    super()
    const _events = (this._events = {})
    ;['onMouseDown', 'onMouseUp', 'onDragStart', 'onDragEnd', 'onDrag'].forEach(
      name => {
        _events[name] = this._handleEvent.bind(this)
      }
    )
  }

  render () {
    const { text } = this.props
    return (
      <div className='card' draggable='true' {...this._events}>
        {text}
      </div>
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
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      data: {
        area1: ['aaa', 'bbb', 'ccc'],
        area2: []
      },
      dndState: ''
    }

    dispatcher.on('dnd:start', () => {
      this.setState({ dndState: 'grab' })
    })
    dispatcher.on('dnd:progress', () => {
      this.setState({ dndState: 'progress' })
    })
    dispatcher.on('dnd:end', () => {
      this.setState({ dndState: '' })
    })
    dispatcher.on('dnd:drop', ({ label, text }) => {
      let { data = {} } = this.state

      data = JSON.parse(JSON.stringify(data))

      Object.keys(data).forEach(key => {
        const cards = data[key] || []
        const idx = cards.indexOf(text)
        if (idx > -1) {
          cards.splice(idx, 1)
        }
      })

      data[label].push(text)
      this.setState({ data, dndState: '' })
    })
  }

  render () {
    const { value } = this.props || {}
    const { dndState, data = {} } = this.state || {}
    const classNames = ['app']
    if (dndState) {
      classNames.push(`app--${dndState}`)
    }

    return (
      <div className={classNames.join(' ')}>
        <Area key={'a1'} label='area1' cards={data.area1} />
        <Area key={'a2'} label='area2' cards={data.area2} />
      </div>
    )
  }
}

// ReactDOM.render(<App />, document.getElementById('app'))
