import React, { Component } from 'react'
import './App.css'

import io from 'socket.io-client'

class App extends Component {
  constructor(props) {
    super(props)
    var socket = io(process.env.REACT_APP_SOCKET)
    this.state = {
      socket
    }
  }

  render() {
    return <React.Fragment />
  }
}

export default App
