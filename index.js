const express = require('express')
const { initializeDatabase } = require('./db/db.connect')
const Book = require('./models/book.model')

const app = express()
app.use(express.json())

initializeDatabase()

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



const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})