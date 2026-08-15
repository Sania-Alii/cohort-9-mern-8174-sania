import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('Notes API Testing', () => {
  
  // Test 1: Security check
  it('should not allow access to notes without an auth token', async () => {
    // without token, hitting get notes api
    const res = await request(app).get('/api/notes');
    
    // expecting error
    expect(res.status).to.equal(401);
    
    // response 
    expect(res.body).to.have.property('success', false);
  });

});