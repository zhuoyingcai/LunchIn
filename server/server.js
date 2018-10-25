const express = require('express');
const morgan = require('morgan');
const router = require('./routes/routes');

// const cors = require('cors');
const app = express();
const server_port = 5000;
const cilent_port = 3000;

app.use(morgan('combined'));
// app.use(cors());
app.use(router);

var server = app.listen(server_port, () => console.log(`Express app listening on port ${server_port}!`));

module.exports = server;
