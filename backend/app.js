const express = require('express');
const mongoose = require('mongoose');
const { errors }= require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
});
app.use(cors());
app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use(router);

app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
