const express = require ("express");
const router = express.Router();
const { addMessage, getMessages } =require ('../controller/MessageController.js');
const multer = require('multer');
const upload = multer();

router.post('/', upload.single('file'), addMessage);

router.get('/:chatId', getMessages);

module.exports = router
