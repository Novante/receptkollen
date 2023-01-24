import express from "express";
import recipeService from "../service/recipeService.js";
const router = express.Router()

router.post('/comparePrice', recipeService.comparePrice)

export default router;
