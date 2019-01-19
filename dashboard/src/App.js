import React, { Component } from 'react'
import './App.css'

import io from 'socket.io-client'

class App extends Component {
  constructor(props) {
    super(props)
    var socket = io(process.env.REACT_APP_SOCKET)

    socket.on('connect', function() {
      socket.emit('authentication', { username: 'admin', password: 'password' })
      socket.on('unauthorized', function(err) {
        console.log('There was an error with the authentication:', err.message)
      })
      socket.on('authenticated', function() {
        socket.on('odd', function(msg) {
          console.log(msg)
        })
      })
    })

    this.state = {
      socket
    }
  }

  render() {
    return <React.Fragment />
  }
}

export default App
