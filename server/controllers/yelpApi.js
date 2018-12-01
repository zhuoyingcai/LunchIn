const yelp = require('yelp-fusion');
const fs = require('fs');

const MAX_YELP_API_REQUESTS = parseInt(process.env.MAX_YELP_API_REQUESTS);
const yelpReqLogFile = process.env.YELP_REQ_LOG;
const yelpReqDataFile = process.env.YELP_REQ_DATA;

var CURR_YELP_KEY_ID = parseInt(process.env.CURR_YELP_KEY_ID);
var clientID = process.env.YELP_CLIENT_IDS.split(",")[CURR_YELP_KEY_ID];
var yelpApiKey = process.env.YELP_API_KEYS.split(",")[CURR_YELP_KEY_ID];
// Initializing a client class that's responsible for making requests with Yelp.
var client = yelp.client(yelpApiKey, { socketTimeout: 5000 });

var tot_requests;
var key_id = 0;

// (Re)initializing Data from the Key
function init(){
  if(!fs.existsSync(yelpReqDataFile)){
    console.log("Yelp Api Key Data does not exist, creating a new file.");
    updateKeyData(yelpReqDataFile, 0);
    tot_requests = 0;
  }
  else{
    fs.readFile(yelpReqDataFile, 'utf8', function(err, data) {
      if (err) throw err;
      const info = data.split(',');
      if(info[0] !== getDay()){
        console.log("Refreshing the requests after a day have passed.");
        updateKeyData(yelpReqDataFile, 0);
        tot_requests = 0;
      }
      else{
        tot_requests = parseInt(info[2]);
      }
    });
  }
}

function updateKeyData(keyData, requests){
  const initKeyData = [getDay(), getTime(), requests];
  if(requests > MAX_YELP_API_REQUESTS){
    handleRequestOverload();
  }
  fs.writeFileSync(keyData, initKeyData.toString(), (error) =>{
    if (err) throw err;
  });
}

function log(action){
  loggingData = [tot_requests, getDay(), getTime(), action];
  tot_requests += 1;
  updateKeyData(yelpReqDataFile, tot_requests);
  fs.appendFile(yelpReqLogFile, loggingData.toString()+"\n", (err) => {
    if (err) throw err;
  });
}

/**
  This method is used to swap api keys which increases the number of requests.
**/
function handleRequestOverload(){
  console.log("MAXIMUM YELP API REQUESTS HAVE BEEN REACHED FOR THIS KEY...");
  CURR_YELP_KEY_ID = (CURR_YELP_KEY_ID + 1) % process.env.NUM_YELP_KEYS;
  process.env.CURR_YELP_KEY_ID = CURR_YELP_KEY_ID;
  clientID = process.env.YELP_CLIENT_IDS.split(",")[CURR_YELP_KEY_ID];
  yelpApiKey = process.env.YELP_API_KEYS.split(",")[CURR_YELP_KEY_ID];
  tot_requests = 0;
  updateKeyData(yelpReqDataFile, tot_requests);
  client = yelp.client(yelpApiKey, { socketTimeout: 5000 });

}
function getDay(){
  const today = new Date();
  return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
}

function getTime(){
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

/**
	METHOD: GET

	REQUIRED PARAMETERS:
		term: Search term, for example "food" or "restaurants".
		location: This string indicates the geographic area to be used when searching for businesses.
**/
function consumeYelpSearch(req, res){
  log("Yelp-Search,"+JSON.stringify(req.query));
  console.log("Consuming Business Search with Parameters", req.query, );
	client.search(req.query)
				.then(response => res.status(200).json(response))
				.catch(e => {
          if(e.statusCode === 429) handleRequestOverload();
          res.status(400).json({error: e});
        });
}

/**
	METHOD: GET

	REQUIRED PARAMETERS:
		id: Business id associated with Yelp. Normally, you'll get the Business ID from Yelp Search requests or Yelp Business Match requests.
**/
function consumeBusinessReviews(req, res){
  log(["Yelp-Review",JSON.stringify(req.query)].toString());
	console.log("Consuming Business Reviews with Parameters", req.query);
	client.reviews(req.query.id)
				.then(response => res.status(200).json(response.jsonBody))
        .catch(e => {
          if(e.statusCode === 429) handleRequestOverload();
          res.status(400).json({error: e});
        });
}

init();
exports.getBusinessSearch = (req, res) => consumeYelpSearch(req, res);
exports.getBusinessReviews = (req, res) => consumeBusinessReviews(req, res);
