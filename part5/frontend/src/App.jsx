import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      setNotificationMessage({ message: 'Login successful', type: 'success' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage({ message: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        addBlogFormRef.current.toggleVisibility()
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        updateBlogs()
      }).catch(error => {
        setNotificationMessage({ message: 'Error in adding blog', type: 'error' })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  const updateBlogs = async () => {
    const newBlogs = await blogService.getAll()
    setBlogs(newBlogs)
  }

  const addBlogFormRef = useRef()

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {user === null ?
        <div>
          <LoginForm
            handleSubmit={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            notificationMessage={notificationMessage}
          />
        </div>:
        <div>
          <h2>blogs</h2>
          <Notification message={notificationMessage} />
          <p>{user.name} logged in</p>
          <button onClick={handleLogout} id='logout-button'>logout</button>
          <Togglable buttonLabel='new blog'
            hideLabel='cancel' ref={addBlogFormRef} id='new-blog-button'>
            <BlogForm addBlog={addBlog}/>
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlogs={updateBlogs} user={user} />
          )}
        </div>
      }
    </div>
  )
}

export default App