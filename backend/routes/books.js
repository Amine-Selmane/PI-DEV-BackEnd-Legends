const express = require ("express")
const router = express.Router()
const Book = require ('../model/book')
const multer = require("multer")
const Rating = require ('../model/rating')

const upload = multer({ dest: "uploads/" }); // Configure multer with desired options

const bookController = require('../controller/bookController');




// Route for adding a book
// Route pour récupérer un livre par son ID
router.get("/getbookbyid/:id", bookController.getBookById);

// Route for getting all books
router.get('', bookController.getall);

// Route for updating a book by ID
router.put('/update/:id', bookController.update);

// Route for deleting a book by ID
router.delete('/deletebook/:id', bookController.deletebook);
/////searching

router.get('/search',bookController.getByTitle);



  router.post("/create", upload.single('file'), bookController.create);
  


module.exports = router