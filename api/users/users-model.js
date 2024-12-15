const db = require('../../data/dbConfig.js');

function getById(id) {
  return db('users')
    .where({ id })
    .first()
}
function getByUsername(username) {
  return db('users')
    .where({ username })
    .first()
 }

 async function add(user) {
  const [newUser] = await db('users')
    .insert(user)
    .returning(['id', 'username', 'password']);
  return newUser;
}

module.exports = {
  add,
  getByUsername,
  getById,
};
