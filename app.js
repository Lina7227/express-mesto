require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { errors } = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());

app.use(require('./routes/auth'));

app.use(auth);
app.use(router);
app.use(errors());
app.use(errors);
app.listen(PORT, () => {

});
