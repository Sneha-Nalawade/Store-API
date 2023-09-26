require('dotenv').config()

//async errors (ig they're known as async errors bcoz they're the errors which have the chances of occuring mostly in/due to the async methods in the code)
require('express-async-errors') //in the task-manager app that we developed before, we either used multiple try-catch blocks or created our own custom middleware(asyncMiddleware)
//to handle errors and exceptions in controllers. but express has a built-in package which does this all..so just install and require it in the app.js file, and you need not take any further actions in thsi regard!
//the built-in package is-> express-async-errors

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

//middleware
app.use(express.json()); //setting up express.json middleware: we're not going to use it in this program, but still writing this inorder to remember the general syntax

//routes
app.get('/', (req, res)=> {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>')
})

//products route
app.use('/api/v1/products', productsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

//we're using this start fn instead of directly using app.listen inorder to run a code that ensures a successful connection to the db before making the app available for listening requests
const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI); //connectDB
        app.listen(port, console.log(`Server is listening to port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

start()

//database name in Mongo atlas need not be same as the project name...can be, cannot be

//Due to express-async-errors, we can levish the benefit of using async code, without even worrying about
//handling the errors using try-catch blocks or custom middlewares(like the asyncMiddleware in the previous task manager application)


// 1) create app.js, run npm init, followed by npm install <all necessary packages>, and launch the server to listen to requests 
//    some general packages needed most of the times -> express, express-async-errors, nodemon, dotenv, mongoose
// 2) connect to db (mongoose in our case), and make necessary requires and awaits in the code, also .env and putting it inside .gitignore included
// 3) identify all possible functionalitites & establish successful routes for them; create routes and controllers folder
// 4) also create middleware folder and all related methods
// 5) ensure proper routing and error-handling throughout the program coded till now
// 6) define schema for the db model
// 7) populate data into the db (since inorder to work with further steps/setting up further functionalities, our db needs to have atleast some dummy data)
// 8) 

//whatever comes from req.body is actually string; u need to type-convert them if needed

//a) filtering diff properties like features, name, company, price etc
//   sample URL -> {{URL}}/products?featured:false&name:e&company:ikea

//b) sorting our data :sorting does not affect the amount of items we're returning...just the order they're displayed in
//   sample URL -> {{URL}}/products?sort=name -> will sort lexicographically wrt name property's value
//   sample URL -> {{URL}}/products?sort=-name -> will sort with reverse-lexicographic (mtlab z-side ke pehle and a-side ke baadme)...so, '-' sign reverses the normal/natural order
//   sample URL -> {{URL}}/products?sort=name,price -> first acc. to name, and incase of same name, sort inorder of price
//   sample URL -> {{URL}}/products?sort=name,-price


