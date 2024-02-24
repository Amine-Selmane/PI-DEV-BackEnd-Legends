const express = require ("express")
const router = express.Router()
const Book = require ('../model/book')
const bookController = require('../controller/bookController');


// Route for adding a book
router.post("/create", bookController.create);
// Route pour récupérer un livre par son ID
router.get('/getbookbyid/:id', bookController.getBookById);

// Route for getting all books
router.get('', bookController.getall);

// Route for updating a book by ID
router.put('/update/:id', bookController.update);

// Route for deleting a book by ID
router.delete('/deletebook/:id', bookController.deletebook);


module.exports = router