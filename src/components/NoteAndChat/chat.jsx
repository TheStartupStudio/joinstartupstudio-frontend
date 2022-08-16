import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import io from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons'
import ActiveUsers from './activeUsers'
import Messages from './messages'
import axiosInstance from '../../utils/AxiosInstance'
import './styles/style.css'
const serverBaseURL = `${process.env.REACT_APP_SERVER_BASE_URL}`

let socket
const initialState = {
  room: 'ROOM',
  allUsers: [],
  users: [],
  messages: [],
  newMsg: '',
  fetchingLocation: false,
  typeYourMessage: 'Type your Message...',
  socketId: ''
}

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState
    }
  }

  componentWillUnmount() {
    const param = {
      room: this.state.room
    }
    socket?.emit('leave', param)
    this?.setState({ ...initialState })
  }

  componentDidUpdate(prevProps, prevState) {
    const scopeThis = this
    if (prevProps.room && prevProps.room !== this.props.room) {
      const currentLanguage = localStorage.getItem('currentLanguage')
      const typeYourMessage =
        currentLanguage === 'es'
          ? 'Escribe tu Mensaje...'
          : 'Type your Message...'
      this.setState({
        room: this.props.room,
        typeYourMessage: typeYourMessage
      })

      const formatMessage = (message) => {
        const localStorageUser = JSON.parse(localStorage.getItem('user'))
        const currentUserName = localStorageUser.user.name
        return {
          ...message,
          isCurrentPerson: message.from === currentUserName
        }
      }

      const getMessages = async (room) => {
        await axiosInstance
          .get(`/chats/${room}`)
          .then((response) => {
            const allUsers =
              response &&
              response.data &&
              response.data.map((item) => item.from)
            const uniqueUsers = [...new Set(allUsers)]

            this.setState({
              messages:
                (response &&
                  response.data.map((item) => formatMessage(item))) ||
                [],
              initialUsers: uniqueUsers
            })
          })
          .catch((err) => err)
      }
      const localStorageUser = JSON.parse(localStorage.getItem('user'))
      const user = localStorageUser.user

      socket.emit('roomChanged', {
        name: user.name,
        newRoom: this.props.room,
        prevRoom: prevProps.room
      })

      const params = {
        name: user.name,
        room: this.props.room
      }

      socket.emit('join', params, function (err) {
        if (err) {
          // this.props.history.push('/')
        }
      })

      socket.on('updateUserList', function (allUsers) {
        scopeThis.setState({
          users: allUsers
        })
      })

      getMessages(this.props.room).then((data) => {
        this.scrollToBottom()
      })
    }
  }

  componentDidMount() {
    const scopeThis = this

    const getUserData = async () => {
      await axiosInstance
        .get(`/users`)
        .then((response) => {
          scopeThis.setState({
            allUsers: response.data
          })
        })
        .catch((err) => err)
    }

    const localStorageUser = JSON.parse(localStorage.getItem('user'))
    const user = localStorageUser.user

    const params = {
      name: user.name,
      room: this.props.room
    }

    socket = io(`${serverBaseURL}`)

    socket.emit('join', params, function (err) {
      if (err) {
        // this.props.history.push('/')
      }
    })

    socket.on('connect', () => {
      scopeThis.setState({
        socketId: socket.id
      })
    })

    socket.on('updateUserList', function (allUsers) {
      scopeThis.setState({
        users: allUsers
      })
    })

    socket.on('newMessage', (message) => {
      var formattedTime = moment(message.createdDate)
      let newMsg = {
        text: message.text,
        from: message.from,
        room: this.props.room,
        createdDate: formattedTime
      }

      const formatMessage = (message) => {
        const localStorageUser = JSON.parse(localStorage.getItem('user'))
        const currentUserName = localStorageUser.user.name
        return {
          ...message,
          isCurrentPerson: message.from === currentUserName
        }
      }

      // saveMessage(newMsg)
      let results =
        scopeThis.state.messages && scopeThis.state.messages.length
          ? scopeThis.state.messages
          : []
      results.push(formatMessage(newMsg))
      scopeThis.setState({
        messages: results
      })

      const msgArr = scopeThis.state.messages
      if (msgArr.length > 3) {
        scopeThis.scrollToBottom()
      }
    })

    socket.on('disconnect', function () {
      console.log('Connection lost from server.')
    })

    const formatMessage = (message) => {
      const localStorageUser = JSON.parse(localStorage.getItem('user'))
      const currentUserName = localStorageUser.user.name
      return {
        ...message,
        isCurrentPerson: message.from === currentUserName
      }
    }

    const getMessages = async (room) => {
      await axiosInstance
        .get(`/chats/${room}`)
        .then((response) => {
          const allUsers =
            response && response.data && response.data.map((item) => item.from)
          const uniqueUsers = [...new Set(allUsers)]

          this.setState({
            messages:
              (response && response.data.map((item) => formatMessage(item))) ||
              [],
            initialUsers: uniqueUsers
          })
        })
        .catch((err) => err)
    }

    getUserData()
    getMessages(this.props.room)
  }

  scrollToBottom() {
    // selectors
    var listHeight = document.querySelector('.messages #list ul')
    var messagesList = document.querySelector('.messages #list')
    var newMessage = document.querySelector('.messages #list ul li:last-child')
    if (newMessage) {
      // heights
      var messagesWrapperHeight = listHeight.clientHeight
      var clientHeight = messagesList.clientHeight
      var scrollTop = messagesList.scrollTop
      var scrollHeight = messagesList.scrollHeight
      var newMessageHeight = newMessage.offsetHeight
      var lastMessageHeight =
        newMessage.previousSibling && newMessage.previousSibling.offsetHeight

      document.querySelector('#list').scrollTo(0, messagesWrapperHeight)
    }
  }

  clearForm() {
    this.setState({
      newMsg: ''
    })
  }

  inputUpdate(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  newMessage(e) {
    e.preventDefault()
    if (!this.state.newMsg) return
    var obj = {
      text: this.state.newMsg
    }
    socket.emit('createMessage', obj, function (data) {})

    const localStorageUser = JSON.parse(localStorage.getItem('user'))
    var formattedTime = moment()
    let newMsg = {
      text: obj.text,
      from: localStorageUser.user.name,
      userId: localStorageUser.user._id,
      room: this.props.room,
      createdDate: formattedTime
    }
    const saveMessage = async (message) => {
      await axiosInstance
        .post(`/chats`, message)
        .then((res) => res)
        .catch((err) => err)
    }

    saveMessage(newMsg)

    this.clearForm()
  }

  sendLocation() {
    this.setState({
      fetchingLocation: true
    })
    if (!navigator.geolocation) {
      return alert('GeoLocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        socket.emit('createLocationMsg', {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        })
      },
      () => {
        alert('Unable to fetch location')
      }
    )
  }

  render() {
    const { newMsg, initialUsers } = this.state
    const currentLanguage = localStorage.getItem('currentLanguage')
    const typeYourMessage =
      currentLanguage === 'es'
        ? 'Escribe tu Mensaje...'
        : 'Type your Message...'

    return (
      <div className='chatPage'>
        <ActiveUsers
          allUsers={this.state.allUsers}
          users={this.state.users}
          initialUsers={initialUsers}
        />
        <div className='messages_wrap'>
          <Messages messages={this.state.messages} room={this.props.room} />
          <div className='newMsgForm'>
            <div className='wrap'>
              <form onSubmit={(e) => this.newMessage(e)}>
                <div className='form_wrap'>
                  <div className='form_row'>
                    <div className='form_item'>
                      <div className='form_input'>
                        <input
                          name='newMsg'
                          placeholder={typeYourMessage}
                          autoComplete='off'
                          value={newMsg}
                          onChange={this.inputUpdate.bind(this)}
                        />
                        <span className='bottom_border'></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='btnWrap'>
                  <button type='submit' className='btn'>
                    <FontAwesomeIcon
                      icon={faTelegramPlane}
                      className='sent-message-icon'
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Chat)
