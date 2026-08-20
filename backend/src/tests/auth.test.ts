import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../server';

dotenv.config();

describe('Auth API Tests', () => {
  const testUser = {
    name: 'Sania Test',
    email: 'sania.test.new@example.com', 
    password: 'password123'
  };

  // Connect to DB before tests

  before(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        const dbUri = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/notes-test-db';
        await mongoose.connect(dbUri);
      }
    } catch (error) {
      throw error;
    }
  });

  // Disconnect
  after(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
      }
    } catch (error) {
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  });

  it('should register a new user successfully', async () => {
    try {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      // check if created successfully 
      expect(res.status).to.equal(201);
      
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('email', testUser.email);
      expect(res.body).to.have.property('token');
    } catch (error) {
      // Error ko rethrow karna hai jaisa bot ne kaha
      throw error;
    }
  });

  it('should login the user and return a token', async () => {
    try {
      const res = await request(app)
        .post('/api/auth/login') 
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    } catch (error) {
      throw error;
    }
  });
  });