import express from 'express'
import dotenv from 'dotenv'
import { connectDatabase } from './src/configs/database.js';
import userRoutes from './src/routes/userRoutes.js'
dotenv.config();
connectDatabase();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: 'Backend is running well'
    })
})

// app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
}) 