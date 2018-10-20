const express = require('express');
const router = express.Router();

const yelpApi = require('../controllers/yelpApi');

router.get('/api/yelp', yelpApi.getApi);
router.post('/api/yelp', yelpApi.postApi);
router.get('/', (req, res) => res.status(200).send('Express Router is responding...'));

module.exports = router;
