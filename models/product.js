const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: [true, 'Product name must be provided']
    },

    price:
    {
        type: Number,
        required: [true, 'Product price must be provided']
    },

    featured:
    {
        type: Boolean,
        default: false
    },

    rating:
    {
        type: Number,
        default: 4.5
    },

    createdAt:
    {
        type: Date,
        default: Date.now() //mongoose provides this object functionality of Date.now() to get the real-time date and time at any point of time (dynamically)
    },

    company:
    {
        type: String,

        //enum property is used to restrict the user input to certain specific values

        // enum: ['ikea', 'liddy', 'caressa', 'marcos'] -> this is simpler way, but if we want to display a msg on wrong input...define enum as an object
        enum: {
          values: ['ikea', 'liddy', 'caressa', 'marcos'],
          message: '{VALUE} is not supported' //this message will be displayed if the entered value is not equal to any of the values specified in the array (values)
        }
    }
})

module.exports = mongoose.model('Product', productSchema);