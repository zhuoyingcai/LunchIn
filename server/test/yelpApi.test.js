 var request = require('supertest');

 describe('Testing Yelp Search Api Functionality', () => {
 	var server;
	beforeEach(() => server = require('./../server'));
	afterEach(() => server.close());
	it('Cannot respond to /api/yelp', done => {
		request(server)
			.get('/api/yelp')
			.expect(400)
			.expect('Content-Type',/json/)
			.end((err, res) => err ? done(err) : done());
	});
	it('Cannot retrieve data without term and location', done => {
		request(server).get('/api/yelp?foo=bar')
      .expect(400)
      .expect('Content-Type',/json/)
      .end((err, res) => err ? done(err) : done());;
	});
	it('Cannot retrieve data without location', done => {
		request(server).get('/api/yelp?term=bar')
      .expect(400)
      .expect('Content-Type',/json/)
      .end((err, res) => err ? done(err) : done());;
	});
	it('Cannot retrieve data without term', done => {
		request(server).get('/api/yelp?location=bar')
      .expect(400)
      .expect('Content-Type',/json/)
      .end((err, res) => err ? done(err) : done());;
	});
	it('Retrieve data with term and location', done => {
		request(server).get('/api/yelp?term=bar&location=New York City')
      .expect(200)
      .expect('Content-Type',/json/)
      .end((err, res) => err ? done(err) : done());;
	});
 });
