// var assert = require('assert');
var request = require('supertest');

describe('Morgan: Testing If Each Express Routes Responds', () => {
  var server;
  beforeEach(() => server = require('./../server'));
  afterEach(() => server.close());
  it('Responds to /testing', done => {
  	request(server).get('/testing').expect(200, done);
  });
  
  it('Respond to GET /api/yelp', done => {
  	request(server)
		.get('/api/yelp')
		.expect(400)
		.expect('Content-Type', /json/)
		.end((err, res) => err ? done(err) : done());
  });

  it('Responds to POST /api/yelp', done => { 
  	request(server)
		.post('/api/yelp')
		.expect(400)
		.expect('Content-Type', /json/)
		.end((err, res) => res ? done(err) : done());
	});

  
});

