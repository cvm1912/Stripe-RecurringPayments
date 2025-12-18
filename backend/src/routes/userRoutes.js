import express from 'express'
const router = express.Router()
import {userRegister,userlogin, updateProfile, customerList, customer} from '../controllers/userController.js'

router.post('/register-user',userRegister);
router.post('/login-user', userlogin);
router.put('/update-profile/:userId', updateProfile)
router.get('/get-customer-list', customerList);
router.get('/get-customer/:userId', customer)

export default router;

