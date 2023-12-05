const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')

morgan.token('body', (req) => {
  if (req.method === 'POST'){
  return JSON.stringify(req.body)
  }
})

// Load morgan as a middleware function with the 'tiny' preset and the 'body' token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send("<h1>Welcome!</h1>")
})

app.get('/api/persons',(req, res) => {
    res.json(persons)
})

app.get('/info',(req,res)=> {
    const today = new Date()
    const time = today.toString()
    res.send(`<p>phonebook has info for ${notes.length} people</p>
    <p>${time}</p>`)
})

app.get('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => id === person.id)
    if (person){
        res.json(person)
    } else (
        res.status(404).end()
    )
    
})

app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const repitition = persons.find(person => person.name === body.name)
    if (!body.number || !body.name) {
        return res.status(400).json({ 
          error: 'Number or Name missing' 
        })
      } else if (repitition) {
        return res.status(400).json({
            error : 'Name is already in the phonebook'
        })
      } else {
      const person = { 
        "id": Math.floor(Math.random() * 1000000),
        "name": body.name, 
        "number": body.number
      }
      persons = persons.concat(person)
      res.json(person)
      console.log(JSON.stringify(person.name))
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})