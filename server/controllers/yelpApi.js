const yelp = require('yelp-fusion');
 const clientID = process.env.YELP_CLIENT_ID;
 const yelpApiKey = process.env.YELP_API_KEY;
// Initializing a client class that's responsible for making requests with Yelp.
const client = yelp.client(process.env.YELP_API_KEY, { socketTimeout: 5000 });


// Deprecated: Outdated To Be Removed After Testing.
function hasValidYelpParams(query, res){
 if(!query.term || !query.location){
		res.status(400).json({ errorMsg: 'Required Yelp parameters are not found.'});
		return false;
	}
	return true;
}


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
  METHOD: POST

	REQUIRED PARAMETERS:
		name: The name of the business.
		address1: The first line of the business’s address.
		city: Required. The city of the business.
		state: The ISO 3166-2 (with a few exceptions) state code of this business. Maximum length is 3.
		country: The ISO 3166-1 alpha-2 country code of this business. Maximum length is 2.

	OPTIONAL PARAMETERS:
		address2: The second line of the business’s address. 
		address3: The third line of the business’s address.
		latitude: The WGS84 latitude of the business in decimal degrees.
		longitude: The WGS84 longitude of the business in decimal degrees. Must be between ­-180 and +180.
		phone: The phone number of the business which can be submitted as (a) locally ­formatted with digits only (e.g., 016703080) or (b) internationally­ formatted with a leading + sign and digits only after (+35316703080). 
		zip_code: The Zip code of this business.
		yelp_business_id: Unique Yelp identifier of the business if available.
		limit: Maximum number of business results to return. By default, it will return 3. Maximum is 10.
		match_threshold: Specifies whether a match quality threshold should be applied to the matched businesses. Must be either 'default' or 'none'.

		Please visit https://www.yelp.com/developers/documentation/v3/business_match for more information.
**/
function consumeBusinessMatch(req, res){
	console.log("Consuming Business Match with Parameters", req.body);
	client.businessMatch('lookup', req.body, res)
				.then(response => res.status(200).json(response.jsonBody.business[0]))
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
exports.postBusinessMatch = (req, res) => consumeBusinessMatch(req, res);
exports.getBusinessReviews = (req, res) => consumeBusinessReviews(req, res);
