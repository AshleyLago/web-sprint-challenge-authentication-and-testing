/*
  #### **Tests**
  - [ ] Write a minimum of 2 tests for each API endpoint in `api/server.test.js`
      - [ ] Write tests for registration endpoint
      - [ ] Write tests for login endpoint
      - [ ] Write tests for restricted access to `/api/jokes`
*/
// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db('users').truncate();
})

afterAll(async () => {
  await db.destroy()
})

const newUser = {
  username: "Faz",
  password: "Baz"
}

//auth-router
describe('[POST] /auth/register', () => {
  test('  [1] Requires username and password from the request body for registration', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Frank' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('username and password required')
  })
  test('  [2] Requires a unique username for registration', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('username taken')
  })
  test('  [3] Successfully registers a user', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('username', 'Faz')
  })
})

describe('[POST] /auth/login', () => {
  test('  [4] Requires username and password from the request body for login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Frank' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('username and password required')
  })
  test('  [5] Requires correct credentials for login', async () => {
    const res = await request(server).post('/api/auth/login').send(newUser)
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('invalid credentials')
  })
  test('  [6] Successfully logs in"', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe(`welcome, ${newUser.username}`)
    expect(res.body).toHaveProperty('token')
  })
})

//jokes-router
describe('[GET] /jokes', () => {
  test('  [7] Responds with "token required"', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('token required')
  })
  test('  [8] Responds with "token invalid"', async () => {
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', 'this wont work')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('token invalid')
  })
  test('  [9] Successfully shows jokes', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const loggedUser = await request(server).post('/api/auth/login').send(newUser)

    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', loggedUser.body.token)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
  })
})