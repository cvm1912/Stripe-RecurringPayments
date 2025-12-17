import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import UserForm from './components/UserForm';
import ProductList from './components/ProductList';
import SubscriptionForm from './components/SubscriptionForm';
import PaymentSuccess from './components/PaymentSuccess';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  
  // Check if we're on success page
  const isSuccessPage = window.location.pathname === '/success';
  
  if (isSuccessPage) {
    return (
      <Elements stripe={stripePromise}>
        <PaymentSuccess />
      </Elements>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <header className="App-header">
          <h1>Stripe Recurring Payments</h1>
          <nav>
            <button 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button 
              className={activeTab === 'products' ? 'active' : ''}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={activeTab === 'subscriptions' ? 'active' : ''}
              onClick={() => setActiveTab('subscriptions')}
            >
              Subscriptions
            </button>
          </nav>
        </header>

        <main>
          {activeTab === 'users' && (
            <UserForm onUserCreated={setCurrentUser} />
          )}
          
          {activeTab === 'products' && (
            <ProductList />
          )}
          
          {activeTab === 'subscriptions' && (
            <SubscriptionForm currentUser={currentUser} />
          )}
        </main>
      </div>
    </Elements>
  );
}

export default App;