// import express from 'express';
const express = require('express');

const app = express();
const port = 4567;

app.get('/api', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
