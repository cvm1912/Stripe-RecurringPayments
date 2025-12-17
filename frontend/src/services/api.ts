import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  createUser: (userData: { name: string; email: string; password: string }) =>
    api.post('/users/create-user', userData),
  
  createStripeCustomer: (userId: string) =>
    api.post('/users/create-stripe-customer', { userId }),
};

export const productAPI = {
  createProduct: (productData: { name: string; description?: string }) =>
    api.post('/products/create-product', productData),
  
  getProducts: () =>
    api.get('/products/get-products'),
};

export const priceAPI = {
  createPrice: (priceData: {
    productId: string;
    unitAmount: number;
    currency: string;
    interval: string;
    intervalCount: number;
  }) => api.post('/prices/create-product-price', priceData),
  
  getPrices: () =>
    api.get('/prices/get-all-product-price'),
};

export const subscriptionAPI = {
  createCheckoutSession: (data: { userId: string; priceId: string }) =>
    api.post('/subscriptions/create-checkout-session', data),
  
  createSubscription: (data: { userId: string; priceId: string; scheduleMinutes?: number }) =>
    api.post('/subscriptions/create-subscription', data),
  
  createAutopaySubscription: (data: { userId: string; priceId: string }) =>
    api.post('/subscriptions/create-autopay-subscription', data),
  
  createScheduledAutopaySubscription: (data: { userId: string; priceId: string; scheduleMinutes?: number }) =>
    api.post('/subscriptions/create-scheduled-autopay', data),
  
  createTestClock: (name?: string) =>
    api.post('/subscriptions/create-test-clock', { name }),
  
  advanceTestClock: (testClockId: string, advanceSeconds: number) =>
    api.post('/subscriptions/advance-test-clock', { testClockId, advanceSeconds }),
  
  quickMinuteTest: (minutes?: number) =>
    api.post('/subscriptions/quick-minute-test', { minutes }),
  
  getSubscriptions: () =>
    api.get('/subscriptions/get-subscriptions'),
};

export default api;