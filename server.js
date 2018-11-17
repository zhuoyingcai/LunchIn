// process.env.NODE_ENV = 'production';
require('dotenv').load();
// console.log(process.env);
const express = require('express');
const morgan = require('morgan');
const router = require('./server/routes/routes');
const path = require('path');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const server_port = process.env.PORT || 5000;
const cilent_port = 3000;

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Serve any static files
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname + '/../build')));
// }
//console.log(__dirname);
app.use(express.static(path.join(__dirname, './build')));
app.use(router);
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname ,'./build', 'index.html'));
});


var server = app.listen(server_port, () => console.log(`Express app listening on port ${server_port}!`));

module.exports = server;
