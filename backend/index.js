import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './src/configs/database.js';
import userRoutes from './src/routes/userRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import priceRoutes from './src/routes/priceRoutes.js'
import subscriptionRoutes from './src/routes/subscription.js'
dotenv.config();
connectDatabase();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Backend is running well'
    })
})

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes );
app.use('/api/v1/prices', priceRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) 