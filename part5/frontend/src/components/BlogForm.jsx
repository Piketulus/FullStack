import { useState } from 'react'

const BlogForm = ( { addBlog } ) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      url: url,
      author: author
    }
    setAuthor('')
    setTitle('')
    setUrl('')
    addBlog(blogObject)
  }

  return(
    <form onSubmit={addNewBlog}>
      <h2>create new</h2>
      <div>
            title:
        <input
          id='title'
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
            author:
        <input
          id='author'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
            url:
        <input
          id='url'
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id='submitBlog' type="submit">create</button>
    </form>
  )
}

export default BlogForm