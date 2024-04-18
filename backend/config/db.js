const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://arslenferchichi:mongodb@cluster0.bvlngnh.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        });
        console.log('Connected to db successfully...');
    } catch (error) {
        console.error('Error connecting to db:', error);
    }
}

module.exports = connectDB;
