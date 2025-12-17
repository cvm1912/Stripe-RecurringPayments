import express from 'express'
const router = express.Router()
import {productPrice, getallproductprice} from '../controllers/priceController.js'

router.post('/create-product-price',productPrice)
router.get('/get-all-product-price', getallproductprice)

export default router;