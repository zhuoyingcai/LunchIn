require('dotenv').load();
// console.log(process.env);
const express = require('express');
const morgan = require('morgan');
const router = require('./routes/routes');
const bodyParser = require('body-parser');

// const cors = require('cors');
const app = express();
const server_port = 5000;
const cilent_port = 3000;

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());
app.use(router);

var server = app.listen(server_port, () => console.log(`Express app listening on port ${server_port}!`));

module.exports = server;
