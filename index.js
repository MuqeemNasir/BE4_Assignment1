const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')
const app = express()

const { initializeDatabase } = require('./db/db.connect')
const Book = require('./models/book.model')

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())

initializeDatabase()
// 1. Create an API with route "/books" to create a new book data in the books Database.
//    Make sure to do error handling.

app.post("/book", async(req, res) => {
    try{
        const newBook = new Book(req.body)
        const savedBook = await newBook.save()
        if(savedBook) {
            res.status(201).json({message: "Book added successfully.", savedBook: newBook})
        }
    }catch(error){
        res.status(500).json({error: "Failed to add books."})
    }
})

// 3. Create an API to get all the books in the database as response. 
//      Make sure to do error handling.

app.get("/book", async(req, res) => {
    try{
        const allBooks = await Book.find()
        if(allBooks.length !== 0){
            res.json(allBooks)
        }else{
            res.status(404).json({error: "Books not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch books."})
    }
})

// 4. Create an API to get a book's detail by its title. 
//      Make sure to do error handling.

app.get("/book/title/:bookTitle", async(req, res) => {
    try{
        const book = await Book.findOne({title: req.params.bookTitle})
        if(book){
            res.status(200).json(book)
        }else{
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book by title."})
    }
})

// 5. Create an API to get details of all the books by an author.
//       Make sure to do error handling.

app.get("/book/author/:author", async(req, res) => {
    try{
        const books = await Book.find({author: req.params.author})
        if(books.length !== 0){
            res.status(200).json(books)
        }else{
            res.status(404).json({error: "Books not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch books by author."})
    }
})

// 6. Create an API to get all the books which are of "Business" genre.

app.get("/book/genre/:genre", async(req, res) => {
    try{
        const books = await Book.find({genre: req.params.genre})
        if(books.length !== 0){
            res.status(200).json(books)
        }else{
            res.status(404).json({error: "Books not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch books by genre."})
    }
})

// 7. Create an API to get all the books which was released in the year 2012.

app.get("/book/publishedYear/:releasedYear", async(req, res) => {
    try{
        const books = await Book.find({publishedYear: req.params.releasedYear})
        if(books.length !== 0){
            res.status(200).json(books)
        }else{
            res.status(404).json({error: "Books not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch books by releasedYear."})
    }
})

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the
//  "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is 
//  not found. Make sure to do error handling.

// Updated book rating: { "rating": 4.5 }

async function updateBookById(bookId, dataToUpdate) {
    try{
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return updatedBook
    }catch(error){
        console.log("Error in updating books.")
    }
    
}

app.post("/book/:bookId", async(req, res) => {
    try{
        const updatedBooks = await updateBookById(req.params.bookId, req.body)
        if(updatedBooks){
            res.status(200).json({message: "Book updated successfully.", updatedBooks: updatedBooks})
        }else{
            res.status(404).json({error: "Book does not exist."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update books by id."})
    }
})

// 9. Create an API to update a book's rating with the help of its title. Update the details
//   of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message 
//  "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }

async function updateBookByTitle(bookTitle, dataToUpdate){
    try{
        const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return updatedBook
    }catch(error){
        console.log("Error in updating books by title.")
    }
}

app.post("/book/title/:bookTitle", async(req, res) => {
    try{
        const updatedBooks = await updateBookByTitle(req.params.bookTitle, req.body)
        
        if(updatedBooks){
            res.status(200).json({message: "Book updated successfully.", updatedBooks: updatedBooks})
        }else{
            res.status(404).json({error: "Book does not exist."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update books by title."})
    }
})

// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found"
//       in case the book does not exist. Make sure to do error handling.

app.delete("/book/:bookId", async(req, res) => {
    try{
        const book = await Book.findByIdAndDelete(req.params.bookId)        
        if(book){
            res.status(200).json({message: "Book deleted successfully"})
        }else{
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to delete book."})
    }
})



// const PORT = 3000

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`)
// })

module.exports = app

module.exports.handler = serverless(app)