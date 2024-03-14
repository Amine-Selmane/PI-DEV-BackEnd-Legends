const express = require ("express")
const router = express.Router()
const Book = require ('../model/book')
const multer = require("multer")

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


//////////////upload file//////////
// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/soula/OneDrive/Bureau/uploads'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      // Set the filename to be unique by appending current timestamp
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Create a multer instance with the configured storage
  const upload = multer({ storage: storage });
  
  // Route for adding a book with file upload
  router.post("/create", upload.single('file'), bookController.create);
  


module.exports = router