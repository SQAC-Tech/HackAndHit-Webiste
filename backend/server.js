import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import connectDB from './model/db.js';
import Team from './model/schema.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Redis client (Upstash requires TLS)
const redis = createClient({
    url: process.env.REDIS_URL,
    socket: { tls: true }
});
redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('connect', () => console.log('Redis connected'));

// Middleware
app.use(cors());
app.use(express.json());

// Simple rate limiter
const rateLimit = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    if (count > 20) return res.status(429).json({ error: 'Too many requests' });
    next();
};

// Connect DB and Redis
connectDB();
redis.connect();

// Health route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST - Create team
app.post('/api/teams', rateLimit, async (req, res) => {
    try {
        const { teamname, teamSize, leadername, leaderemail, leaderphone,
            member1name, member1email, member1phone,
            member2name, member2email, member2phone,
            member3name, member3email, member3phone } = req.body;

        const existing = await Team.findOne({ teamname });
        if (existing) return res.status(400).json({ error: 'Team name exists' });

        const team = new Team({
            teamname, teamSize: teamSize || 1,
            leader: { name: leadername, email: leaderemail, phone: leaderphone },
            ...(teamSize >= 2 && { member1: { name: member1name, email: member1email, phone: member1phone } }),
            ...(teamSize >= 3 && { member2: { name: member2name, email: member2email, phone: member2phone } }),
            ...(teamSize >= 4 && { member3: { name: member3name, email: member3email, phone: member3phone } })
        });
        await team.save();
        await redis.del('teams:all');
        res.status(201).json({ success: true, data: team });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - All teams
app.get('/api/teams', rateLimit, async (req, res) => {
    try {
        const cached = await redis.get('teams:all');
        if (cached) return res.json({ cached: true, data: JSON.parse(cached) });

        const teams = await Team.find().sort({ createdAt: -1 });
        await redis.setEx('teams:all', 300, JSON.stringify(teams));
        res.json({ cached: false, data: teams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Single team
app.get('/api/teams/:id', rateLimit, async (req, res) => {
    try {
        const { id } = req.params;
        const cached = await redis.get(`teams:${id}`);
        if (cached) return res.json({ cached: true, data: JSON.parse(cached) });

        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        await redis.setEx(`teams:${id}`, 300, JSON.stringify(team));
        res.json({ cached: false, data: team });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Update team
app.put('/api/teams/:id', rateLimit, async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!team) return res.status(404).json({ error: 'Team not found' });

        await redis.del('teams:all');
        await redis.del(`teams:${req.params.id}`);
        res.json({ success: true, data: team });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Delete team
app.delete('/api/teams/:id', rateLimit, async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        await redis.del('teams:all');
        await redis.del(`teams:${req.params.id}`);
        res.json({ success: true, message: 'Team deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
