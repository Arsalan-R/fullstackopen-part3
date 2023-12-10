
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req) => {
  if (req.method === 'POST'){
  return JSON.stringify(req.body)
  }
})

//errors
const unknownEndpoint = (req,res) => {
  res.status(404).send({ error: 'unkown endpoint '})
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

 if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Load morgan as a middleware function with the 'tiny' preset and the 'body' token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.send("<h1>Welcome!</h1>")
})

app.get('/api/persons',(req, res) => {
    Person.find({}).then (people => {
      res.json(people)
    })
})

app.get('/api/persons/:id',(req,res) => {
  Person.find({ _id: req.params.id })
  .then( person => {
  if (person){
      res.json(person)
  } else (
      res.status(404).end()
  )
  })
})

app.get('/info',(req,res)=> {
    const today = new Date()
    const time = today.toString()
    res.send(`<p>phonebook has info for ${notes.length} people</p>
    <p>${time}</p>`)
})

app.delete('/api/persons/:id',(req,res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    // Check if the result is truthy
    if (result) {
      // Send a 204 status code and a message
      res.status(204).send('Person deleted successfully')
    } else {
      // Send a 404 status code and a JSON object
      res.status(404).json({ error: 'Person not found' })
    }
  })
  .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
    const body = req.body
    
    if (!body.number || !body.name) {
        return res.status(400).json({ 
          error: 'Number or Name missing' 
        })
      } else {
      const person = new Person ({ 
        "id": Math.floor(Math.random() * 1000000),
        "name": body.name, 
        "number": body.number
      })
      person.save().then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (req, res, next) => {
const body = req.body

const person = {
  id : body.id,
  name : body.name,
  number : body.number,
}

Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query'} )
.then(updatedPerson => {
  res.json(updatedPerson)
})
.catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})