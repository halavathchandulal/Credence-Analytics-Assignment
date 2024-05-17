const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(bodyParser.json())

mongoose
  .connect('mongodb://localhost:27017/bookstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
  })
  .then(() => {
    console.log('MongoDB connected...')
    populateInitialData() // Call function to populate data after connection
  })
  .catch(err => console.log(err))

// Schema and Model
const bookSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String,
})

const Book = mongoose.model('Book', bookSchema)

// Initial books data
const initialBooks = [
  {
    name: 'Harry Potter and the Order of the Phoenix',
    img: 'https://bit.ly/2IcnSwz',
    summary:
      "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry.",
  },
  {
    name: 'The Lord of the Rings: The Fellowship of the Ring',
    img: 'https://bit.ly/2tC1Lcg',
    summary:
      'A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed.',
  },
  {
    name: 'Avengers: Endgame',
    img: 'https://bit.ly/2Pzczlb',
    summary:
      'Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.',
  },
]

// Function to populate initial books
async function populateInitialData() {
  try {
    await Book.insertMany(initialBooks)
    console.log('Database populated with initial books')
  } catch (error) {
    console.error('Error populating database:', error)
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Bookstore API')
})

// Create a book
app.post('/books', async (req, res) => {
  const book = new Book(req.body)
  try {
    const savedBook = await book.save()
    res.status(201).json(savedBook)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

// Read all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Read a single book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({message: 'Book not found'})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (updatedBook) {
      res.status(200).json(updatedBook)
    } else {
      res.status(404).json({message: 'Book not found'})
    }
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id)
    if (deletedBook) {
      res.status(200).json({message: 'Book deleted'})
    } else {
      res.status(404).json({message: 'Book not found'})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Add specific routes to get each book
app.get('/harrypotter', async (req, res) => {
  try {
    const book = await Book.findOne({
      name: 'Harry Potter and the Order of the Phoenix',
    })
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({message: 'Book not found'})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/lordoftherings', async (req, res) => {
  try {
    const book = await Book.findOne({
      name: 'The Lord of the Rings: The Fellowship of the Ring',
    })
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({message: 'Book not found'})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

app.get('/avengers', async (req, res) => {
  try {
    const book = await Book.findOne({name: 'Avengers: Endgame'})
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({message: 'Book not found'})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
