require('dotenv').load();

const express = require('express');
const morgan = require('morgan');
const router = require('./routes/routes');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

var server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

module.exports = server;
