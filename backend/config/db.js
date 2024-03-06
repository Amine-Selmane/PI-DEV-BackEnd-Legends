const mongoose = require('mongoose')

const connectDB = async() =>{
    try {
        const conn1 = await mongoose.connect(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI_SRV)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
        console.log(`MongoDB Connected: ${conn1.connection.host}`.cyan.underline)
    } catch (error){
        console.error(error);
        process.exit(1)
    }
}

module.exports = connectDB