import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './model/db.js';
import { connectRedis } from './config/redis.js';
import teamRoutes from './routes/teamRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and Redis
connectDB();
connectRedis();

// Routes
app.use('/api', teamRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Hack and Hit API' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
