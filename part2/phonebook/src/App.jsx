import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import NewForm from './components/NewForm'
import Numbers from './components/Numbers'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filtered, setFiltered] = useState(persons)
  const [showFiltered, setShowFiltered] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    if (checkNameExists(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotificationMessage({ message: `Updated ${returnedPerson.name}`, type: 'success' })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          }).catch(error => {
            setNotificationMessage({ message: `Information of ${person.name} has already been removed from server`, type: 'error' })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== person.id))
          })
      } else {
        return
      }
    } else {
        const personObject = {
          name: newName,
          number: newNumber
        }

        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotificationMessage({ message: `Added ${returnedPerson.name}`, type: 'success' })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          }).catch(error => {
              setNotificationMessage({
                message: `${error.response.data.error}`,
                type: 'error'
              })
              setTimeout(() => {
                setNotificationMessage(null)
              }, 5000)
          })
    }
  }

  const checkNameExists = (name) => {
    return persons.some(person => person.name === name)
  }

  const handleFilterChange = (event) => {
    const filter = event.target.value
    if (filter === '') {
      setShowFiltered(false)
      return
    }
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    setFiltered(filteredPersons)
    setShowFiltered(true)
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMessage({ message: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const showing = showFiltered ? filtered : persons

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notificationMessage}/>
        <Filter handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
        <NewForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} addName={addName}/>
      <h2>Numbers</h2>
        <Numbers showing={showing} deletePerson={deletePerson}/>
    </div>
  )
}

export default App