const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Uzmi username i sobu iz URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Prikljuci se sobi
socket.emit('joinRoom', { username, room });

//Vrati sobu i korisnike
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Serverska poruka
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Automatski skroluj
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Posalji poruku
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Uzmi tekst poruke
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  //Slanje poruke serveru
  socket.emit('chatMessage', msg);

  // Ocisti polje za unos
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output poruka
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Dodaj korisnika
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Napustanje chata
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});