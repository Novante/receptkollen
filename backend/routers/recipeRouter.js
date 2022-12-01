import express from "express";
import recipeController from "../controller/recipeController.js";
const router = express.Router()

router.post('/comparePrice', recipeController.comparePrice)

export default router;
