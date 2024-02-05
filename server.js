const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Postavi staticki folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';
//Izvrsava se kad se poveze klijent
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Dobrodoslica ulogovanom
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //Kad se klijent poveze
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //Slanje sobe i korisnika
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Osluskivanje chata
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //Izvrsava se kad se klijent diskonektuje
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
    }
    
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));