import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from  './Blog'
import axiosMock from 'axios'

jest.mock('axios')

const blog = {
  title: 'Test Blog',
  author: 'John',
  url: 'test.com',
  likes: 10,
  user: {
    username: 'test',
    id: '123'
  },
  id: '1233'
}

const testUser = {
  username: 'test',
  name: 'test',
  id: '123'
}

test('renders content', () => {

  render(<Blog blog = {blog} user={testUser} />)

  const title = screen.queryByText('Test Blog')
  expect(title).toBeDefined()

  const author = screen.queryByText('John')
  expect(author).toBeDefined()

  const url = screen.queryByText('test.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('10')
  expect(likes).toBeNull()
})

test('url and likes shown after button is clicked', async () => {

  render(<Blog blog = {blog} user={testUser} />)
  const user = userEvent.setup()
  const button = screen.queryByText('view')
  await user.click(button)

  const url = screen.queryByText('test.com')
  expect(url).toBeDefined()

  const likes = screen.queryByText('10')
  expect(likes).toBeDefined()
})

test('event handler called twice when likes are clicked twice', async () => {
  const mockHandler = jest.fn()

  const component = render(<Blog blog={blog} user={blog.user} updateBlogs={mockHandler}/>)
  const element = component.getByText('view')
  fireEvent.click(element)

  const button = screen.getByText('like')
  axiosMock.put.mockResolvedValueOnce({ data: blog })
  fireEvent.click(button)

  axiosMock.put.mockResolvedValueOnce({ data: blog })
  fireEvent.click(button)

  await waitFor(() => {
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})