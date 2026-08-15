import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('Health Check API', () => {
  
  it('should return a 200 status and a success message', async () => {
    // sending request to server
    const res = await request(app).get('/health');
    
    // check status
    expect(res.status).to.equal(200);
    
    // check response
    expect(res.body).to.have.property('message', 'Server is running perfectly');
  });

});