import express from 'express'
const router = express.Router()
import {createProduct,getProducts} from '../controllers/productController.js'

router.post('/create-product',createProduct);
router.get('/get-products', getProducts);

export default router;