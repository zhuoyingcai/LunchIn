const express = require('express');
const router = express.Router();
const path = require('path');

const yelpApi = require('../controllers/yelpApi');

router.get('/api/yelp', yelpApi.getApi);
router.post('/api/yelp', yelpApi.postApi);

router.get('/', (req, res) => res.status(200).send('Express Router is responding...'));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  // Handle React routing, return all requests to React app
  router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../../build/index.html'));
  });
}

module.exports = router;
