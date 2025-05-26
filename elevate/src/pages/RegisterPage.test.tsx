import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from './RegisterPage';
import * as authService from '../services/authService';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock the authService
jest.mock('../services/authService');

const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
  const mockRegister = authService.register as jest.MockedFunction<typeof authService.register>;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock console.error to avoid error logs in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders the registration form', () => {
    renderComponent();
    
    expect(screen.getByRole('heading', { name: /create a new account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates email and password fields', async () => {
    renderComponent();
    
    // Submit form without filling any fields
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check for validation errors
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    
    // Test invalid email format
    userEvent.type(screen.getByLabelText(/email address/i), 'invalid-email');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    
    // Test short password
    userEvent.type(screen.getByLabelText(/password/i), '123');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com' }
    };
    
    // Mock successful registration
    mockRegister.mockResolvedValueOnce(mockResponse);
    
    renderComponent();
    
    // Fill in the form
    userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'test123');
    
    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check if the register function was called with the right data
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'test123'
      });
    });
    
    // Check if navigation occurred after successful registration
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', expect.anything());
    });
  });

  it('displays an error message when registration fails', async () => {
    // Mock failed registration
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'));
    
    renderComponent();
    
    // Fill in the form
    userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'test123');
    
    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check if error message is displayed
    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
  });

  it('shows loading state when form is submitting', async () => {
    // Mock a slow API response
    mockRegister.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' }
      }), 1000))
    );
    
    renderComponent();
    
    // Fill in the form
    userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'test123');
    
    // Submit the form
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check if loading state is shown
    expect(await screen.findByText(/creating account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });
});
