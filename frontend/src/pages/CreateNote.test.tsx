import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateNote from './CreateNote';

// mock the api calls 
jest.mock('../api/axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  get: jest.fn(() => Promise.resolve({ data: { success: true, data: {} } }))
}));

test('check if page header renders', () => {
  render(
    <BrowserRouter>
      <CreateNote />
    </BrowserRouter>
  );
  
  let heading = screen.getByText('Create New Note');
  expect(heading).toBeInTheDocument();
});

test('input fields should be on the screen', () => {
  render(
    <BrowserRouter>
      <CreateNote />
    </BrowserRouter>
  );
  
  let titleInput = screen.getByLabelText('Note Title');
  
  expect(titleInput).toBeInTheDocument();
});

test('cancel button is working and clickable', () => {
  render(
    <BrowserRouter>
      <CreateNote />
    </BrowserRouter>
  );
  
  let cancelBtn = screen.getByText('Cancel');
  fireEvent.click(cancelBtn);
  
  // checking if it is enabled
  expect(cancelBtn).toBeEnabled();
});