import express from "express"
import { getLabsByCity } from "../controllers/labController.js"


const router = express.Router()

router.get("/", getLabsByCity)

export default router
