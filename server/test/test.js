// var assert = require('assert');
var request = require('supertest');

describe('Morgan: Testing If Each Express Routes Responds', () => {
  var server;
  beforeEach(() => server = require('./../server'));
  afterEach(() => server.close());
  it('Responds to /testing', done => {
  	request(server).get('/testing').expect(200, done);
  });

  it('Does not respond to GET /api/yelp', done => {
  	request(server)
		.get('/api/yelp')
		.expect(404)
		.end((err, res) => err ? done(err) : done());
  });

  it('Does not respond to POST /api/yelp', done => {
  	request(server)
		.post('/api/yelp')
		.expect(404)
		.end((err, res) => res ? done(err) : done());
	});


});
