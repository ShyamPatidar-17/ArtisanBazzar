import express from 'express'

import { placeOrderCOD,placeOrderStripe,allOrders,updateStatusUser,updateStatusAdmin,userOrders,verifyStripe } from "../controllers/orderController.js";
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter=express.Router();


//Admin Panel
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status', authUser, updateStatusUser);
orderRouter.post('/statusAdmin',adminAuth,updateStatusAdmin)


//Payment
orderRouter.post('/place',authUser,placeOrderCOD)
orderRouter.post('/stripe',authUser,placeOrderStripe)


//User Panel
orderRouter.post('/userorders',authUser,userOrders)


//verifying the online payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter;