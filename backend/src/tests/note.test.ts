import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../server';
import Note from '../models/Note';

describe('Notes API Testing', () => {
  
  // variables to store token and note id 
  let authToken = '';
  let savedNoteId = '';
  let testEmail = '';  
  let testUserId = '';

  // setup db and get token before testing notes
 before(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/notes-test-db');
      }
      // Dynamic email 
      testEmail = `testuser_${Date.now()}@test.com`;

      // creating a dummy user for testing
      const dummyUser = { name: 'test user', email: testEmail, password: 'password123' };
      const regRes = await request(app).post('/api/auth/register').send(dummyUser);
      
// 3. check register status
      expect(regRes.status).to.equal(201);
      testUserId = regRes.body._id;

      // login with new email
      const loginRes = await request(app).post('/api/auth/login').send({
        email: testEmail,
        password: 'password123'
      });
      
      //check login status
     expect(loginRes.status).to.equal(200);
      authToken = loginRes.body.token;
    } catch (error) {
      throw error;
    }
  });

  // cleanup after tests 
  after(async () => {
    try {
      // delete the dummy user 
      await mongoose.connection.collection('users').deleteOne({ email: testEmail });
      
      // delete the dummy user notes
      if (testUserId) {
        await Note.deleteMany({ user: testUserId }); 
      }
    } catch (error) {
      throw error;
    } finally {
      await mongoose.disconnect();
    }
  });
     

  // Test 1: Security check
  it('should not allow access to notes without an auth token', async () => {
    try {
      // without token, hitting get notes api
      const res = await request(app).get('/api/notes');
      
      // expecting error
      expect(res.status).to.equal(401);
      
      // response 
      expect(res.body).to.have.property('success', false);
    } catch (error) {
      throw error;
    }
  });

  // Test 2: Create a note
  it('should create a new note when user is logged in', async () => {
    try {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'My First Note',
          content: 'This is some test content'
        });
        
      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      
      // saving the id of created note to use in update/delete tests
      savedNoteId = res.body.data._id;
    } catch (error) {
      throw error;
    }
  });

  // Test 3: Get all notes
  it('should get all notes of the user', async () => {
    try {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
    } catch (error) {
      throw error;
    }
  });

  // Test 4: Update a note
  it('should update the note successfully', async () => {
    try {
      const res = await request(app)
        .put(`/api/notes/${savedNoteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Note Title',
          content: 'Updated content here'
        });
        
      expect(res.status).to.equal(200);
      expect(res.body.data.title).to.equal('Updated Note Title');
    } catch (error) {
      throw error;
    }
  });

  // Test 5: Delete a note
  it('should delete the note', async () => {
    try {
      const res = await request(app)
        .delete(`/api/notes/${savedNoteId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Note deleted successfully');
    } catch (error) {
      throw error;
    }
  });

});