const yelp = require('yelp-fusion');
const clientID = process.env.YELP_CLIENT_ID;
const yelpApiKey = process.env.YELP_API_KEY;
// Initializing a client class that's responsible for making requests with Yelp.
const client = yelp.client(process.env.YELP_API_KEY, { socketTimeout: 5000 });

/**
	METHOD: GET

	REQUIRED PARAMETERS:
		term: Search term, for example "food" or "restaurants".
		location: This string indicates the geographic area to be used when searching for businesses.
**/
function consumeYelpSearch(req, res){
	console.log("Consuming Yelp Search with Parameters: ", req.query);
	client.search(req.query)
				.then(response => res.status(200).json(response))
				.catch(e => res.status(400).json({error: e}));
}

/**
	METHOD: GET

	REQUIRED PARAMETERS:
		id: Business id associated with Yelp. Normally, you'll get the Business ID from Yelp Search requests or Yelp Business Match requests.
**/
function consumeBusinessReviews(req, res){
	console.log("Consuming Business Reviews with Parameters", req.query);
	client.reviews(req.query.id)
				.then(response => res.status(200).json(response.jsonBody))
				.catch(e => res.status(400).json({error: e}));
}

exports.getBusinessSearch = (req, res) => consumeYelpSearch(req, res);
exports.getBusinessReviews = (req, res) => consumeBusinessReviews(req, res);
