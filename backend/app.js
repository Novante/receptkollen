import express from 'express'
import recipeRouter from './routers/recipeRouter.js'
// import './database/databaseInit.js'

const app = express();
const port = 3001;

app.use(express.json());
app.use('/', recipeRouter)

app.listen(port, () => {
    console.log(`Running server at: http://localhost:${port})`)
})

