const { log } = require('console')
const mongoose = require('mongoose')
const { stringify } = require('querystring')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to mongodb')
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookScehma = new mongoose.Schema( {
    name: {
      type: String,
      minLength : 3,
      required : true,
    },
    number: {
      type : String,
      minLength : 8,
      required : true,
      match: /^\d{2,3}-\d{7,}/
    }
})

phonebookScehma.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person', phonebookScehma)