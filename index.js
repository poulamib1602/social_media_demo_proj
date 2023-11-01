const express = require('express');
const logger = require('./logger');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);


app.listen(port, () => {
    logger.info(`Server kkkk is running on port ${port}`);
    
});
