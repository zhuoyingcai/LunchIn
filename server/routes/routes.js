const express = require('express');
const router = express.Router();

const yelpApi = require('../controllers/yelpApi');

router.get('/api/yelp/search', yelpApi.getBusinessSearch);
router.post('/api/yelp/match', yelpApi.postBusinessMatch);
router.get('/api/yelp/reviews', yelpApi.getBusinessReviews);

router.get('/', (req, res) => res.status(200).send('Express Router is responding...'));

module.exports = router;
