const express = require ("express")
const cors = require("cors");
const colors = require('colors')
const dotenv = require ("dotenv").config()
const connectDB = require("./config/db")
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000 
const courses = require("./routes/coursesRoutes")
const morgan = require('morgan');
const router = require('./routes/restRoutes.js')
const EventRoutes = require('./routes/EventRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');


// const Event = require('./model/event');


connectDB()
const app = express()

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');


// app.use('/path', require('./routes/restRoutes')) uncomment and change the path depending on yours // require stays like that

/** api routes for user */
app.use('/api',router)

app.use('/', EventRoutes); 
app.use('/', ReservationRoutes); 

require('dotenv').config()

const { upload, uploadMultiple } = require('./middleware/multer')

const { getStorage, ref ,uploadBytesResumable } = require('firebase/storage')
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { auth } = require('./config/firebase.config')



// async function uploadImage(file, quantity) {
//     const storageFB = getStorage();

//     await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

//     if (quantity === 'single') {
//         const dateTime = Date.now();
//         const fileName = `images/${dateTime}`
//         const storageRef = ref(storageFB, fileName)
//         const metadata = {
//             contentType: file.type,
//         }
//         await uploadBytesResumable(storageRef, file.buffer, metadata);
//         return fileName
//     }

//     if (quantity === 'multiple') {
//         for(let i=0; i < file.images.length; i++) {
//             const dateTime = Date.now();
//             const fileName = `images/${dateTime}`
//             const storageRef = ref(storageFB, fileName)
//             const metadata = {
//                 contentType: file.images[i].mimetype,
//             }

//             const saveImage = await Image.create({imageUrl: fileName});
//             file.item.imageId.push({_id: saveImage._id});
//             await file.item.save();

//             await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

//         }
//         return
//     }

// }


// app.post('/test-upload', upload, async (req, res) => {
//     const file = {
//         type: req.file.mimetype,
//         buffer: req.file.buffer
//     }
//     try {
//         const buildImage = await uploadImage(file, 'single'); 
//         res.send({
//             status: "SUCCESS",
//             imageName: buildImage
//         })
//     } catch(err) {
//         console.log(err);
//     }
// })


// app.post('/saveImageUrl', async (req, res) => {
//   try {
//     const { imageUrl } = req.body;

//     // Create a new event with just the imageUrl
//     const newEvent = new Event({ imageUrl: imageUrl });

//     // Save the new event to the database
//     const savedEvent = await newEvent.save();

//     console.log('Saved Image URL:', savedEvent.imageUrl);

//     res.status(200).json({ message: 'Image URL saved successfully', imageUrl });
//   } catch (error) {
//     console.error('Error saving image URL:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
  
 
// app.post('/saveImageUrl', async (req, res) => {
//   try {
//     const { eventId, imageUrl } = req.body;

//     // Check if eventId is provided
//     if (eventId) {
//       // If eventId is provided, update the existing event's imageUrl
//       const updatedEvent = await Event.findByIdAndUpdate(
//         eventId,
//         { imageUrl: imageUrl },
//         { new: true }
//       );

//       if (!updatedEvent) {
//         // Handle if the event with the given ID is not found
//         return res.status(404).json({ error: 'Event not found' });
//       }

//       console.log('Updated Event with Image URL:', updatedEvent);
//       res.status(200).json({ message: 'Event with Image URL updated successfully', event: updatedEvent });
//     } else {
//       // If eventId is not provided, create a new event with the imageUrl
//       const { name, date, beginTime, endTime, location, description, price, nbrPlaces } = req.body;
//       const newEvent = new Event({
//         name,
//         date,
//         beginTime,
//         endTime,
//         location,
//         description,
//         price,
//         nbrPlaces,
//         imageUrl,
//       });

//       const savedEvent = await newEvent.save();

//       console.log('Saved Event with Image URL:', savedEvent);
//       res.status(200).json({ message: 'Event with Image URL saved successfully', event: savedEvent });
//     }
//   } catch (error) {
//     console.error('Error saving image URL:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post('/saveImageUrl', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Save imageUrl to the database
    const savedImageUrl = await ImageUrl.create({ imageUrl });

    // Log the saved document for verification (optional)
    console.log('Saved Image URL:', savedImageUrl);

    // Respond with a success status
    res.status(200).send('Image URL saved successfully');
  } catch (error) {
    console.error('Error saving image URL to database:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
