import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './src/configs/database.js';
import userRoutes from './src/routes/userRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import priceRoutes from './src/routes/priceRoutes.js'
import subscriptionRoutes from './src/routes/subscription.js'
import webhookRoutes from './src/routes/webhook.js'
dotenv.config();
connectDatabase();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// capture raw body for debugging malformed JSON
app.use(express.json({
    verify: (req, res, buf, encoding) => {
        try {
            req.rawBody = buf.toString(encoding || 'utf8');
        } catch (e) {
            req.rawBody = undefined;
        }
    }
}));

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
app.use('/webhook', webhookRoutes);


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) 

// JSON parse error handler (returns raw body for debugging)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && (err.type === 'entity.parse.failed' || err.status === 400)) {
        console.error('Invalid JSON received:', err.message);
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON in request body',
            error: err.message,
            rawBody: req.rawBody
        });
    }
    next(err);
});