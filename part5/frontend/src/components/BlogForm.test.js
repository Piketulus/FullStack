import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<blog form works correctly', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()
  const { container } = render(<BlogForm addBlog={createBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Trying to test this')
  await user.type(authorInput, 'John')
  await user.type(urlInput, 'test.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Trying to test this')
  expect(createBlog.mock.calls[0][0].author).toBe('John')
  expect(createBlog.mock.calls[0][0].url).toBe('test.com')
})