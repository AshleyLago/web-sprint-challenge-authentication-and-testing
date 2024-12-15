/*
  #### **Authentication Workflow**
  - [ ] Implement [POST] `/api/auth/register` to create a new account
      - [ ] Hash user passwords using bcryptjs
  - [ ] Implement [POST] `/api/auth/login` to generate a JWT token upon successful login
      - [ ] Use jsonwebtoken library to create the token
  - [ ] Create `auth-router.js` inside `api/auth/` to manage authentication routes
*/
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../users/users-model')
const JWT_SECRET = process.env.JWT_SECRET || "shh"
const BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || 8

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.
  DO NOT EXCEED 2^8 ROUNDS OF HASHING!

  1- In order to register a new account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel", // must not exist already in the `users` table
      "password": "foobar"          // needs to be hashed before it's saved
    }

  2- On SUCCESSFUL registration,
    the response body should have `id`, `username` and `password`:
    {
      "id": 1,
      "username": "Captain Marvel",
      "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
    }

  3- On FAILED registration due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED registration due to the `username` being taken,
    the response body should include a string exactly as follows: "username taken".
*/
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    if (await Users.getByUsername(username)) {
      return res.status(400).json({ message: "username taken" });
    }

    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)

    const newUser = await Users.add({ username, password: hash})
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
});

/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.

  1- In order to log into an existing account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel",
      "password": "foobar"
    }

  2- On SUCCESSFUL login,
    the response body should have `message` and `token`:
    {
      "message": "welcome, Captain Marvel",
      "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    }

  3- On FAILED login due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    the response body should include a string exactly as follows: "invalid credentials".
*/
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" })
    }

    const user = await Users.getByUsername(username)
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = buildToken(user)
      res.status(200).json({ message: `welcome, ${user.username}`, token})
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    next(err)
  }
  
});



module.exports = router;