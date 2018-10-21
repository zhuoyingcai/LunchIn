// var assert = require('assert');
var request = require('supertest');

describe('Morgan: Testing If Each Express Routes Responds', function() {
  var server;
  beforeEach(() => server = require('./../server'));
  afterEach(() => server.close());
  it('Responds to /', done => {
  	request(server).get('/').expect(200, done);
  });
  
  it('Respond to GET /api/yelp', done => {
  	request(server)
		.get('/api/yelp')
		.expect(200)
		.expect('Content-Type', /json/)
		.end((err, res) => err ? done(err) : done());
  });

  it('Responds to POST /api/yelp', done => { 
  	request(server)
		.post('/api/yelp')
		.expect(200)
		.expect('Content-Type', /json/)
		.end((err, res) => res ? done(err) : done());
	});

  
});
