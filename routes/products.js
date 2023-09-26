const express = require ('express')
const router = express.Router()

const {getAllProductsStatic, getAllProducts} = require('../controllers/products');  //destructuring used 

router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);

module.exports = router;