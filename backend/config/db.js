const mongoose = require('mongoose');

const connectDB = async () => {
    try {
<<<<<<< HEAD
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true // Ajoutez cette option si nécessaire
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
=======
        const conn = await mongoose.connect(process.env.MONGO_URI_SRV)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error){
>>>>>>> main
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;

// const mongoose = require('mongoose')

// const connectDB = async() =>{
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI)
//         console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
//     } catch (error){
//         console.error(error);
//         process.exit(1)
//     }
// }

// module.exports = connectDB