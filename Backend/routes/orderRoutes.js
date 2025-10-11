import express from 'express'

import { placeOrderCOD,placeOrderStripe,adminOrders,updateOrderItemStatus,userOrders,verifyStripe, countOrders, getMyOrders } from "../controllers/orderController.js";
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter=express.Router();


//Admin Panel
orderRouter.post('/list',adminAuth,adminOrders)
orderRouter.post('/status', authUser(), updateOrderItemStatus);
orderRouter.post('/statusAdmin',adminAuth,updateOrderItemStatus)

orderRouter.get('/list',adminAuth,adminOrders);


//Payment
orderRouter.post('/place',authUser(),placeOrderCOD)
orderRouter.post('/stripe',authUser(),placeOrderStripe)


//User Panel
orderRouter.post('/userorders',authUser(),userOrders)
orderRouter.get('/my-orders',authUser(),getMyOrders)


//verifying the online payment
orderRouter.post('/verifyStripe',authUser(),verifyStripe)


export default orderRouter;