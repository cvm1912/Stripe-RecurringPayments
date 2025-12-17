import React, { useState } from 'react';
import { userAPI } from '../services/api';

interface UserFormProps {
  onUserCreated: (user: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await userAPI.createUser(formData);
      if (response.data.success) {
        setMessage('User created successfully!');
        onUserCreated(response.data.data);
        
        // Create Stripe customer
        await userAPI.createStripeCustomer(response.data.data.userId);
        setMessage('User and Stripe customer created successfully!');
        
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      setMessage(error.response?.data?.message || error.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
      
      {message && <p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}
    </div>
  );
};

export default UserForm;