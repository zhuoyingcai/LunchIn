const yelp = require('yelp-fusion');
const clientID = 'H_7NXPInp_41ZuEroRrm0w';
const yelpApiKey = 'whkFooEOGksI2QwFSlH384Ms_QthKYxnr6mhtM2KQdbKyh5AroW28JH_bS0N7Jzk3xhl0qwD4v61vnSiyrqAqvwxqjh_A-QovSzYq-bjDKyo3j5QhyMQXh7sEPzAW3Yx';

/**
	Soon to be implemented:

**/
function hasValidYelpParams(query, res){
	if(!query.term || !query.location){
		res.status(400).json({ errorMsg: 'Required Yelp parameters are not found.'});
		return false;
	}
	return true;
}

function consumeYelpSearch(req, res){
	if(hasValidYelpParams(req.query, res)){
		let client = yelp.client(yelpApiKey);
		client.search(req.query)
					.then(response => res.status(200).json(response))
					.catch(e => res.status(400).json({errorMsg: e}));
	}
}
exports.getApi = (req, res) => consumeYelpSearch(req, res);
exports.postApi = (req, res) => consumeYelpSearch(req, res);
