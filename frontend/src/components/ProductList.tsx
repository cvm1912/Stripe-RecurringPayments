import React, { useState, useEffect } from 'react';
import { productAPI, priceAPI } from '../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);

  
  const [productForm, setProductForm] = useState({
    name: '',
    description: ''
  });
  
  const [priceForm, setPriceForm] = useState({
    productId: '',
    unitAmount: '',
    currency: 'usd',
    interval: 'month',
    intervalCount: 1
  });

  useEffect(() => {
    fetchProducts();
    fetchPrices();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await priceAPI.getPrices();
      setPrices(response.data.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productAPI.createProduct(productForm);
      setProductForm({ name: '', description: '' });
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleCreatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await priceAPI.createPrice({
        ...priceForm,
        unitAmount: parseInt(priceForm.unitAmount) * 100, // Convert to cents
      });
      setPriceForm({ productId: '', unitAmount: '', currency: 'usd', interval: 'month', intervalCount: 1 });
      setShowPriceForm(false);
      fetchPrices();
    } catch (error) {
      console.error('Error creating price:', error);
    }
  };

  return (
    <div className="product-container">
      <div className="section">
        <h2>Products</h2>
        <button onClick={() => setShowProductForm(!showProductForm)}>
          {showProductForm ? 'Cancel' : 'Add Product'}
        </button>
        
        {showProductForm && (
          <form onSubmit={handleCreateProduct} className="form">
            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            />
            <button type="submit">Create Product</button>
          </form>
        )}
        
        <div className="items-grid">
          {products.map((product: any) => (
            <div key={product._id} className="item-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <small>ID: {product._id}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Prices</h2>
        <button onClick={() => setShowPriceForm(!showPriceForm)}>
          {showPriceForm ? 'Cancel' : 'Add Price'}
        </button>
        
        {showPriceForm && (
          <form onSubmit={handleCreatePrice} className="form">
            <select
              value={priceForm.productId}
              onChange={(e) => setPriceForm({ ...priceForm, productId: e.target.value })}
              required
            >
              <option value="">Select Product</option>
              {products.map((product: any) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              placeholder="Amount (in dollars)"
              value={priceForm.unitAmount}
              onChange={(e) => setPriceForm({ ...priceForm, unitAmount: e.target.value })}
              required
            />
            
            <select
              value={priceForm.interval}
              onChange={(e) => setPriceForm({ ...priceForm, interval: e.target.value })}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
            
            <button type="submit">Create Price</button>
          </form>
        )}
        
        <div className="items-grid">
          {prices.map((price: any) => (
            <div key={price._id} className="item-card">
              <h3>${(price.unitAmount / 100).toFixed(2)}</h3>
              <p>Every {price.intervalCount} {price.interval}(s)</p>
              <p>Product: {price.product?.name}</p>
              <small>ID: {price._id}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;