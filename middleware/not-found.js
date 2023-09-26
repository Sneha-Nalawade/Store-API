const notFound = (req, res) => {
    //throw new Error('testing async errors') :- we can introduce such errors inside controllers to check how they're dealed with/handled automatically by the express-async-errors package, iff we have installed and required it in app.js
    res.status(404).send('Route does not exist');
}

module.exports = notFound