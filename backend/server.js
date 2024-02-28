const express = require ("express")
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const port = process.env.PORT || 5000 // 5000 is the default
const EventRoutes = require('./routes/EventRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');
const cors = require('cors');

connectDB()

const app = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', EventRoutes); 
app.use('/', ReservationRoutes); 

require('dotenv').config()

const { upload, uploadMultiple } = require('./middleware/multer')

const { getStorage, ref ,uploadBytesResumable } = require('firebase/storage')
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { auth } = require('./config/firebase.config')



async function uploadImage(file, quantity) {
    const storageFB = getStorage();

    await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

    if (quantity === 'single') {
        const dateTime = Date.now();
        const fileName = `images/${dateTime}`
        const storageRef = ref(storageFB, fileName)
        const metadata = {
            contentType: file.type,
        }
        await uploadBytesResumable(storageRef, file.buffer, metadata);
        return fileName
    }

    if (quantity === 'multiple') {
        for(let i=0; i < file.images.length; i++) {
            const dateTime = Date.now();
            const fileName = `images/${dateTime}`
            const storageRef = ref(storageFB, fileName)
            const metadata = {
                contentType: file.images[i].mimetype,
            }

            const saveImage = await Image.create({imageUrl: fileName});
            file.item.imageId.push({_id: saveImage._id});
            await file.item.save();

            await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

        }
        return
    }

}


app.post('/test-upload', upload, async (req, res) => {
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer
    }
    try {
        const buildImage = await uploadImage(file, 'single'); 
        res.send({
            status: "SUCCESS",
            imageName: buildImage
        })
    } catch(err) {
        console.log(err);
    }
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
