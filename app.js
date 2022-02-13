const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6206406c4b73f0a2556d583f', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use(router);
app.listen(PORT, () => {

});
