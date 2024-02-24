const Book = require('../Models/book');


const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
    
        const book = await Book.findById(id);
    
        return res.status(200).json(book);
      } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
      }
};


async function create(req, res) {
    try {
        console.log('data', req.body);
        const book = new Book(req.body);
        await book.save();
        res.status(200).send("added successfully");
    } catch (err) {
        res.status(400).send({ error: err });
    }
}

async function getall(req, res) {
    try {
        const books = await Book.find({});
    
        return res.status(200).json({
          count: books.length,
          data: books,
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
      }
}

async function update(req, res) {
    try {
        await Book.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send("updated");
    } catch (err) {
        res.status(400).send(err);
    }
}

async function deletebook(req, res) {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted");
            } catch(err){
                res.status(400).send(err);
            }        
       
}

module.exports = {getBookById, create, getall, update, deletebook };
