import PropTypes from 'prop-types'
import Notification from './Notification'

const LoginForm = ({
  handleSubmit,
  setUsername,
  setPassword,
  username,
  password,
  notificationMessage
}) => {
  return (
    <div>
      <h2>Login</h2>
      <Notification message={notificationMessage} />
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'
            value={username}
            onChange={({ target }) => {
              setUsername(target.value)}}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            onChange={({ target }) => {
              setPassword(target.value)}}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm