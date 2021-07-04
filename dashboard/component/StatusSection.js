
import dispatcher from '../module/dispatcher'
import React from 'react'
import Status from './Status'



class StatusSection extends React.Component {
  constructor () {
    super()
    this.state = {
      data: {
        resources: ['ID-123','ID-124','ID-125'],
        toDo: [],
        doing: [],
        done: []
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

          <Status key={'a1'} label='resources' cards={data.resources} />
          <Status key={'a2'} label='toDo' cards={data.toDo} />
          <Status key={'a3'} label='doing' cards={data.doing} />
          <Status key={'a4'} label='done' cards={data.done} />
        
      </div>
    )
  }
}

export default StatusSection
