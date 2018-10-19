// import express from 'express';
const express = require('express');
const router = require('./routes/routes');
const app = express();
const server_port = 5000;
const cilent_port = 3000;

// app.get('/api', (req, res) => res.status(200).send('Hello World!'));
app.use(router);

var server = app.listen(server_port, () => console.log(`Express app listening on port ${server_port}!`));

module.exports = server;
