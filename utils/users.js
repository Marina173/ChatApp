const users = [];

//Pridruzi se chatu
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

//Vrati trentunog usera
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//User napusta chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Vrati korisnike rooma
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};