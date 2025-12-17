import React from 'react';

interface PaymentSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionData?: any;
}

const PaymentSuccessPopup: React.FC<PaymentSuccessPopupProps> = ({ 
  isOpen, 
  onClose, 
  subscriptionData 
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <div className="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-content">
          <div className="success-message">
            <p>🎉 Your autopay subscription has been activated successfully!</p>
          </div>
          
          {subscriptionData && (
            <div className="subscription-info">
              <h3>Subscription Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className="value status-active">{subscriptionData.status}</span>
                </div>
                <div className="info-item">
                  <span className="label">Amount:</span>
                  <span className="value">${(subscriptionData.price?.unitAmount / 100).toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Billing:</span>
                  <span className="value">Every {subscriptionData.price?.interval}</span>
                </div>
                <div className="info-item">
                  <span className="label">Next Payment:</span>
                  <span className="value">
                    {subscriptionData.currentPeriodEnd 
                      ? new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="autopay-benefits">
            <h4>🔄 Autopay Benefits</h4>
            <ul>
              <li>✅ Automatic payments - no manual action needed</li>
              <li>📧 Email confirmations for each payment</li>
              <li>🔒 Secure payment method saved</li>
              <li>⚙️ Manage subscription anytime</li>
            </ul>
          </div>
        </div>
        
        <div className="popup-footer">
          <button className="primary-btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPopup;