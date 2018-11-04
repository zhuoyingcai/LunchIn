var FRONTEND_API_KEYS = ["GOOGLE_MAPS_API_KEY", "FIREBASE_API_KEY"];
function hasValidApiKeyParams(body, res){
	if(!body.apiKey || !FRONTEND_API_KEYS.includes(body.apiKey)){
		res.status(400).json({ errorMsg: 'Failed to retrieve Api Key'});
		return false;
	}
	return true;
}
function postApiKey(req, res){
	console.log("REQUEST BODY", req.body);
	if(hasValidApiKeyParams(req.body, res)){
		let apiKey = process.env[req.body.apiKey];
		if(apiKey === undefined || apiKey === null){
			res.status(501).json({ errorMsg: 'This Api Key is not set on the server.'});
		}
		else{
			res.status(200).json({ apiKey: apiKey });
		}
	}
}

exports.postApiKey = (req, res) => postApiKey(req, res);

