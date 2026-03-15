import express from 'express'
import authUser from "../middleware/authMiddleware.js";
import  {getHistory} from '../controllers/history.js'
const historyRoutes = express.Router();


historyRoutes.get("/history", authUser, getHistory);


export default historyRoutes