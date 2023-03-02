const express = require('express');
const app = express()
// const server = require('http')(app);
const cors = require('cors')
const morgan = require('morgan')

//DB details
const mongoose = require('mongoose')


const route = require('./route/router')

//env eniviroment variable path
require('dotenv').config({path:"./config/.env"})



//cors origin issue
app.use(cors({origin:"*"}))

//middleware
app.use(morgan('dev'))
app.use(express.json())


app.use('/',route)

const url = process.env.URL

mongoose.set('strictQuery', true)

mongoose.connect(url)  
        .then(() => {
         console.log("Connected to the database!");
          })
        .catch(err => {
            console.log("Cannot connect to the database!", err);
            process.exit();
        });



const PORT = process.env.PORT || 4545
app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT} `);
})
