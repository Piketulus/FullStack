const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('1234', 10)
  const userObject = new User({
    username: 'hellas',
    passwordHash: passwordHash
  })

  await userObject.save()

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  const user = await User.findOne({ username: 'hellas' })
  const newBlog = {
    title: 'A new blog',
    url: 'newpost.com',
    likes: 10,
    user: user._id
  }
  await Blog.insertMany(newBlog)

})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
}, 100000)

test('get all the blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(4)
}, 100000)

test('id is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
}, 100000)

test('creating a new blog post', async () => {
    const newBlog = {
        title: 'A new blog',
        author: 'James Newman',
        url: 'newpost.com',
        likes: 10
    }

    const loginResponse = await api.post('/api/login')
      .send({ username: 'hellas', password: '1234' })
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 2)
  
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'A new blog'
    )
})

test('likes defaults to zero', async () => {
    const newBlog = {
        title: 'A new blog',
        author: 'James Newman',
        url: 'newpost.com'
    }

    const loginResponse = await api.post('/api/login')
      .send({ username: 'hellas', password: '1234' })

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
})

test('missing title and url', async () => {
    const newBlog = {
        author: 'James Newman',
    }

    const loginResponse = await api.post('/api/login')
      .send({ username: 'hellas', password: '1234' })

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('deleting a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[3]

    const loginResponse = await api.post('/api/login')
      .send({ username: 'hellas', password: '1234' })
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )
  
    const titles = blogsAtEnd.map(b => b.title)
  
    expect(titles).not.toContain(blogToDelete.title)
})

test('updating a blog posts likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = blogToUpdate.likes + 1

    const updatedBlog = {
        likes: newLikes
    }

    const loginResponse = await api.post('/api/login')
      .send({ username: 'hellas', password: '1234' })
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(updatedBlog)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length + 1
    )
  
    const likes = blogsAtEnd.map(b => b.likes)
  
    expect(likes).toContain(newLikes)
})

test('authentication fails without token', async () => {
  const newBlog = {
    title: 'A new blog',
    author: 'James Newman',
    url: 'newpost.com',
    likes: 10
}

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})


afterAll(async () => {
    await mongoose.connection.close()
})