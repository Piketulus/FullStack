const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
      })
})

app.get('/info', (req, res) => {
    Person.countDocuments({}).then(count => {
        const message = `Phonebook has info for ${count} people`
        const date = new Date()
        res.send(`<p>${message}</p><p>${date}</p>`)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if(person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    const person = new Person({
        name: body.name,
        number: body.number
      })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true }).then(updatedPerson =>
    {
      response.json(updatedPerson)
    }).catch(error => next(error))
})
  

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
  }
  
  app.use(errorHandler)