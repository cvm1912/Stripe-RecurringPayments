import React, { useState, useEffect } from 'react';
import { subscriptionAPI, priceAPI } from '../services/api';
import PaymentSuccessPopup from './PaymentSuccessPopup';

interface SubscriptionFormProps {
  currentUser: any;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ currentUser }) => {
  const [prices, setPrices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [scheduleMinutes, setScheduleMinutes] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [scheduledSubscriptions, setScheduledSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchPrices();
    fetchSubscriptions();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await priceAPI.getPrices();
      setPrices(response.data.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getSubscriptions();
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const startPaymentCountdown = (subscriptionData: any, totalMinutes: number) => {
    let timeLeft = totalMinutes * 60;
    
    const timer = setInterval(() => {
      timeLeft -= 1;
      
      const minutesLeft = Math.floor(timeLeft / 60);
      const secondsLeft = timeLeft % 60;
      setMessage(`⏰ Payment will process in ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        simulatePaymentSuccess(subscriptionData);
      }
    }, 1000);
  };
  
  const simulatePaymentSuccess = async (scheduledItem: any) => {
    setMessage('⏰ Time completed! Processing payment now...');
    
    try {
      // Now actually create the subscription
      const response = await subscriptionAPI.createSubscription({
        userId: scheduledItem.user.userId,
        priceId: scheduledItem.price._id,
        scheduleMinutes: 0 // Immediate creation now
      });

      if (response.data.success) {
        setMessage('🎉 Payment processed successfully! Autopay activated.');
        setSuccessData(response.data.data.subscription);
        setShowSuccessPopup(true);
        
        // Remove from scheduled list
        setScheduledSubscriptions(prev => 
          prev.filter(item => item._id !== scheduledItem._id)
        );
        
        // Refresh subscriptions
        fetchSubscriptions();
      }
    } catch (error: any) {
      setMessage('❌ Payment failed: ' + (error.response?.data?.message || 'Unknown error'));
      
      // Remove from scheduled list even if failed
      setScheduledSubscriptions(prev => 
        prev.filter(item => item._id !== scheduledItem._id)
      );
    }
  };

  const handleCreateSubscription = async () => {
    if (!currentUser || !selectedPrice) {
      setMessage('Please select a user and price');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (scheduleMinutes > 0) {
        // Just schedule - don't create subscription yet
        const selectedPriceData = prices.find((p: any) => p._id === selectedPrice);
        
        const scheduledItem = {
          _id: Date.now().toString(),
          user: currentUser,
          price: selectedPriceData,
          scheduleMinutes: scheduleMinutes,
          status: 'scheduled'
        };
        
        setScheduledSubscriptions(prev => [...prev, scheduledItem]);
        setMessage(`Payment scheduled for ${scheduleMinutes} minutes. Timer started!`);
        startPaymentCountdown(scheduledItem, scheduleMinutes);
      } else {
        // Immediate subscription
        const response = await subscriptionAPI.createSubscription({
          userId: currentUser.userId,
          priceId: selectedPrice,
          scheduleMinutes: 0
        });

        if (response.data.success) {
          setSuccessData(response.data.data.subscription);
          setShowSuccessPopup(true);
          setMessage('Autopay subscription created successfully!');
          fetchSubscriptions();
        }
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error creating subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-container">
      <h2>Create Autopay Subscription</h2>
      
      {!currentUser && (
        <p className="warning">Please create a user first in the Users tab</p>
      )}
      
      {currentUser && (
        <div className="user-info">
          <h3>Current User: {currentUser.name}</h3>
          <p>Email: {currentUser.email}</p>
        </div>
      )}
      
      <div className="subscription-form">
        <div>
          <label>Select Price Plan:</label>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            disabled={!currentUser}
          >
            <option value="">Choose a plan</option>
            {prices.map((price: any) => (
              <option key={price._id} value={price._id}>
                {price.product?.name} - ${(price.unitAmount / 100).toFixed(2)}/{price.interval}
              </option>
            ))}
          </select>
        </div>
        
        <div className="scheduling-section">
          <label>Schedule Payment (Optional):</label>
          <div className="schedule-controls">
            <input
              type="number"
              value={scheduleMinutes}
              onChange={(e) => setScheduleMinutes(parseInt(e.target.value) || 0)}
              min="0"
              max="60"
              placeholder="0"
            />
            <span>minutes (0 = immediate)</span>
          </div>
        </div>
        
        <div className="button-group">
          <button
            onClick={handleCreateSubscription}
            disabled={loading || !currentUser || !selectedPrice}
            className="create-subscription-btn"
          >
            {loading ? 'Processing...' : 
             scheduleMinutes > 0 ? `Schedule Payment (+${scheduleMinutes}min)` : 'Create Autopay Now'}
          </button>
        </div>
      </div>
      
      {message && (
        <p className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </p>
      )}
      
      {scheduledSubscriptions.length > 0 && (
        <div className="scheduled-payments">
          <h3>⏰ Scheduled Payments</h3>
          {scheduledSubscriptions.map((sub: any) => (
            <div key={sub._id} className="scheduled-item">
              <div className="scheduled-info">
                <span className="amount">${(sub.price?.unitAmount / 100).toFixed(2)}</span>
                <span className="interval">/{sub.price?.interval}</span>
              </div>
              <div className="countdown">
                Processing in {sub.scheduleMinutes} min...
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="subscriptions-list">
        <h3>Active Subscriptions</h3>
        {subscriptions.length === 0 ? (
          <p>No subscriptions found</p>
        ) : (
          <div className="items-grid">
            {subscriptions.map((sub: any) => (
              <div key={sub._id} className="item-card">
                <h4>Status: {sub.status}</h4>
                <p>User: {sub.user?.name}</p>
                <p>Price: ${(sub.price?.unitAmount / 100).toFixed(2)}</p>
                <p>Interval: {sub.price?.interval}</p>
                <small>ID: {sub._id}</small>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <PaymentSuccessPopup 
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        subscriptionData={successData}
      />
    </div>
  );
};

export default SubscriptionForm;