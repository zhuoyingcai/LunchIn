require('dotenv').load();

const express = require('express');
const morgan = require('morgan');
const router = require('./routes/routes');
const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
  // Handle React routing, return all requests to React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

var server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

module.exports = server;
