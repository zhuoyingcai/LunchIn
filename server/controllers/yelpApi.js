const yelp = require('yelp-fusion');
const clientID = process.env.YELP_CLIENT_ID;
const yelpApiKey = process.env.YELP_API_KEY;
// console.log(process.env);
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
