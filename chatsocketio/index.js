const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const redis = require('socket.io-redis')
io.adapter(redis())

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const port = process.env.PORT || 3001
const jwtSecret = process.env.JWT_SRECT || 'socketio-com-react'

const session = require('express-session')
const sharedSession = require('express-socket.io-session')

const Room = require('./models/room')
const Message = require('./models/message')

const cors = require('cors')
app.use(express.static('public'))
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())
const jwt = require('jsonwebtoken')




const expressSession = session({
  secret: 'socketio',
  cookie: {
    maxAge: 10 * 60 * 1000
  }
})
app.use(expressSession)
io.use(sharedSession(expressSession, { autoSave: true }))
io.use(async (socket, next) => {
  const tokenIsValid = await jwt.verify(socket.handshake.query.token, jwtSecret)
  if (!socket.handshake.query.token || !tokenIsValid) {
    next(new Error('Auth failed.'))
  } else {
    next()
  }
})

app.post('/auth', async (req, res) => {
  const token = await jwt.sign({
    data: {
      name: req.body.name
    }
  }, jwtSecret)

  res.send({
    token
  })
})

io.on('connection', socket => {
  console.log('connected', socket.id)
  // salas iniciais
  Room.find({}, (err, rooms) => {
    socket.emit('roomList', rooms)
  })
  // addRoom
  socket.on('addRoom', roomName => {
    const room = new Room({
      name: roomName
    })
    room
      .save()
      .then(() => {
        io.emit('newRoom', room)
      })
  })

  // Remove Room
  socket.on('removeRoom', roomId => {
    Room.findOneAndRemove({ _id: roomId }, (err, _) => console.log(err))
  })
  // join na sala
  socket.on('join', roomId => {
    socket.join(roomId)
    Message
      .find({ room: roomId })
      .then(msgs => {
        socket.emit('msgsList', { messages: msgs, room: roomId })
      })
  })
  socket.on('sendMsg', async msg => {
    const decoded = await jwt.decode(socket.handshake.query.token, jwtSecret)
    const message = new Message({
      author: decoded.data.name,
      when: new Date(),
      msgType: 'text',
      message: msg.msg,
      room: msg.room
    })
    message
      .save()
      .then(() => {
        io.to(msg.room).emit('newMsg', message)
        Message
          .find({ room: msg.room })
          .then(msgs => {
            io.sockets.emit('msgsList', { messages: msgs, room: msg.room })
          })

      })
  })

  socket.on('cleanRoom', roomId => {
    Message.deleteMany({ room: roomId })
      .then(() => {
        Message
          .find({ room: roomId })
          .then(msgs => {
            io.sockets.emit('msgsList', { messages: msgs, room: roomId })
          })
      })
  })

})

mongoose
  .connect('mongodb://localhost/chat-socketio', { useMongoClient: true })
  .then(() => {
    http.listen(port, () => {
      console.log('Chat running... ', port)
    })
  })
