const express = require('express');
const router = express.Router();

const yelpApi = require('../controllers/yelpApi');

router.get('/api/yelp', yelpApi.test);
router.get('/', (req, res) => res.status(200).send('Router is responding...'));

module.exports = router;
