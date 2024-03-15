//Importing project dependancies
import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors' 
import helmet from 'helmet'
import newsRouter from './routes/newsRouter';

//App Varaibles 
dotenv.config();
const PORT = process.env.PORT || 3000

//Intializing the express app 
const app = express(); 

//Using the dependencies
app.use(helmet()); 
app.use(cors()); 
app.use(express.json())

//Routes
app.use('/api/news', newsRouter);

app.listen(PORT, async () => {
   console.log(`listening on port ${PORT}`)
})

export = { app }