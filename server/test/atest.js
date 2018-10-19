var assert = require('assert');
var request = require('supertest');

describe('Loading Express...', function() {
  var server;
  beforeEach(() => server = require('./../server'));
  afterEach(() => server.close());
  it('Responds to /', done => request(server).get('/').expect(200, done));
});
