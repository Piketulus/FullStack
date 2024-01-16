const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('1234', 10)
    const userObject = new User({
        username: 'hellas',
        name: 'Arto Hellas',
        passwordHash: passwordHash
    })
    await userObject.save()
})

test('username at least 3 characters', async () => {
    const newUser = {
        username: 'he',
        name: 'Arto Hellas',
        password: '1234'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('username must be unique', async () => {
    const newUser = {
        username: 'hellas',
        name: 'Arto Hellas',
        password: '1234'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('password at least 3 characters', async () => {
    const newUser = {
        username: 'Jorge',
        name: 'Jo',
        password: '12'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})