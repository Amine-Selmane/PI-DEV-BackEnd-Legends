const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Book = require('../model/book');

const bookController = require('../controller/bookController');

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Set your destination folder

// Route for adding a book with file upload to Cloudinary
router.post("/create", upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const { title, description, price,quantity } = req.body;

  try {
    // Check if files were uploaded
    if (!req.files || !req.files.file || !req.files.image) {
      return res.status(400).send("Files not uploaded");
    }

    // Upload file to Cloudinary
    const fileUploadResponse = await cloudinary.uploader.upload(req.files.file[0].path, {
      upload_preset: "books",
    });

    // Upload image to Cloudinary
    const imageUploadResponse = await cloudinary.uploader.upload(req.files.image[0].path, {
      upload_preset: "books",
    });

    // Create a new book with Cloudinary URLs
    const book = new Book({
      title,
      description,
      price,

      file: fileUploadResponse.secure_url,
      image: imageUploadResponse.secure_url,
      quantity,

    });

    // Save the book to the database
    const savedBook = await book.save();

    res.status(200).send(savedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

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




  


module.exports = router