import React, { useEffect, useState } from 'react';
import { subscriptionAPI } from '../services/api';

const PaymentSuccess: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getSubscriptions();
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="success-container">
      <div className="success-message">
        <h1>🎉 Payment Successful!</h1>
        <p>Your autopay subscription has been activated successfully.</p>
      </div>

      <div className="subscription-details">
        <h2>Your Active Subscriptions</h2>
        {loading ? (
          <p>Loading subscriptions...</p>
        ) : subscriptions.length > 0 ? (
          <div className="subscriptions-grid">
            {subscriptions.map((sub: any) => (
              <div key={sub._id} className="subscription-card">
                <h3>Status: {sub.status}</h3>
                <p><strong>User:</strong> {sub.user?.name}</p>
                <p><strong>Price:</strong> ${(sub.price?.unitAmount / 100).toFixed(2)}</p>
                <p><strong>Billing:</strong> Every {sub.price?.interval}</p>
                <p><strong>Next Payment:</strong> {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}</p>
                <div className="autopay-indicator">
                  <span className="autopay-badge">🔄 Autopay Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No active subscriptions found.</p>
        )}
      </div>

      <div className="next-steps">
        <h3>What happens next?</h3>
        <ul>
          <li>✅ Your payment method is saved securely</li>
          <li>🔄 Future payments will be processed automatically</li>
          <li>📧 You'll receive email confirmations for each payment</li>
          <li>⚙️ You can manage your subscription anytime</li>
        </ul>
      </div>

      <div className="action-buttons">
        <button onClick={() => window.location.href = '/'} className="primary-btn">
          Back to Dashboard
        </button>
        <button onClick={fetchSubscriptions} className="secondary-btn">
          Refresh Subscriptions
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;