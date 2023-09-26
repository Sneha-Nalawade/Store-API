// this file will enter all the product objects from products.json file into the database
//cfor this, we'll have to:-1) setup a db connection, 2)use the 'Product' model as such mongoose models have many built-in functions that can be directly used (like deleteMany())

require('dotenv').config()

const connectDB = require('./db/connect') //besides app.js, we'll also have to require this here as we have to connect with the db through this file as well now, and have to thereafter enter all the products data in the products.json file into the database
const Product = require('./models/product') //will need this model to use its many methods

const jsonProducts = require('./products.json')

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany() //inorder to delete all previous products inside the database, if any product exists
        await Product.create(jsonProducts)
        console.log('SUCCESS!!!')
        process.exit(0) //this would make the control exit running this file once our task of adding products to the db is successfully completed...so that the start() here wont continue running even after that (not using this didnt give any error, but its better to use this process.exit anyways)
                        // 0 -> denotes that everything went well and that there was success
    } catch (error) {
        console.log(error);
        process.exit(1) // 1 -> denotes failure at some point/error
    }
}

start()
