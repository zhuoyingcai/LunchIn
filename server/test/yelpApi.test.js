 var request = require('supertest');
describe('Testing Yelp API', () =>{
  var server;
  beforeEach(() => server = require('./../server'));
  afterEach(() => server.close());
  describe('Testing Yelp Search Functionality', () => {
  	it('Cannot respond to /api/yelp/search', done => {
  		request(server)
  			.get('/api/yelp/search')
  			.expect(400)
  			.expect('Content-Type',/json/)
  			.end((err, res) => err ? done(err) : done());
  	});
  	it('Cannot retrieve data without term and location', done => {
  		request(server)
        .get('/api/yelp/search?foo=bar')
        .expect(400)
        .expect('Content-Type',/json/)
        .end((err, res) => err ? done(err) : done());
  	});
  	it('Cannot retrieve data without location', done => {
  		request(server)
        .get('/api/yelp/search?term=bar')
        .expect(400)
        .expect('Content-Type',/json/)
        .end((err, res) => err ? done(err) : done());
  	});
  	it('Can retrieve data without term', done => {
  		request(server)
        .get('/api/yelp/search?location=bar')
        .expect(200)
        .expect('Content-Type',/json/)
        .end((err, res) => err ? done(err) : done());
  	});
  	it('Retrieve data with term and location', done => {
  		request(server)
        .get('/api/yelp/search?term=bar&location=New York City')
        .expect(200)
        .expect('Content-Type',/json/)
        .end((err, res) => err ? done(err) : done());
  	});
  });
  describe('Testing Yelp Search Functionality', () => {
    it('Cannot retrieve review with no ID', done =>{
      request(server)
        .get('/api/yelp/reviews?foo=bar')
        .expect(400)
        .end((err, res) => err ? done(err) : done());
    });
    it('Cannot retrieve review with fake ID', done =>{
      request(server)
        .get('/api/yelp/reviews?id=foobar')
        .expect(400)
        .end((err, res) => err ? done(err) : done());
    });
    it('Can retrieve review with legit ID', done =>{
      request(server)
        .get('/api/yelp/reviews?id=E8RJkjfdcwgtyoPMjQ_Olg')
        .expect(200)
        .expect('Content-Type',/json/)
        .end((err, res) => err ? done(err) : done());
    });
  });
});
