const express = require('express');


const cors = require('cors');
const authRouter = require('./src/routers/authRouter');
const connectDB = require('./src/configs/db');
const app = express();
require('dotenv').config();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);

connectDB();

app.listen(PORT, (error) => {
    if (error){
        console.log(error);
        return;
    }
    console.log(`Server starting at http://localhost:${PORT}`);
})