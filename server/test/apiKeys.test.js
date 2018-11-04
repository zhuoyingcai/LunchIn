var request = require('supertest');

describe('Testing Api Keys Retrieval Functionality', () => {
	var server;
	beforeEach (() => server = require('./../server'));
	afterEach(() => server.close());
	it('retrieves nothing from /apiKey', done => {
		request(server)
			.post('/apiKey')
			.expect(400)
			.expect('Content-Type',/json/)
			.end((err, res) => err ? done(err) : done());
	});
	it('retrieves Google Maps Api Key from /apiKey', done => {
		request(server)
			.post('/apiKey')
			.send({"apiKey":"GOOGLE_MAPS_API_KEY"})
			.expect(200)
			.expect('Content-Type',/json/)
			.end((err, res) => err ? done(err) : done());
	});
	it('retrieves Firebase Api Key from /apiKey', done => {
		request(server)
			.post('/apiKey')
			.send({"apiKey":"FIREBASE_API_KEY"})
			.expect(200)
			.expect('Content-Type',/json/)
			.end((err, res) => err ? done(err) : done());
	});
	it('gets an 400 error for incorrect apiKey', done => {
		request(server)
			.post('/apiKey')
			.send({"apiKey":"Foo"})
			.expect(400)
			.expect('Content-Type',/json/)
			.end((err, res) => err ? done(err) : done());
	});

});
