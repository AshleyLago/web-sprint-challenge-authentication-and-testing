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

function add(user) {
  return db('users')
  .insert(user)
  .returning(['id', 'username', 'password'])
}

module.exports = {
  add,
  getByUsername,
  getById,
};
