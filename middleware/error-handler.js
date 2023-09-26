const errorHandlerMiddleware = async (err, req, res, next) => {
    console.log(err)
    return res.status(500).json({msg: `Something went wrong, plz try again later`});
}

module.exports = errorHandlerMiddleware