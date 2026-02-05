import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import connectDB from './model/db.js';
import Team from './model/schema.js';
import Admin from './model/adminSchema.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key_2024';

// Redis client (Upstash requires TLS)
const redis = createClient({
    url: process.env.REDIS_URL,
    socket: { tls: true }
});
redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('connect', () => console.log('Redis connected'));

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hack-and-hit-webiste.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// JWT Verification Middleware
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized - No token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

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

// ============ ADMIN AUTH ROUTES ============

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: isProd,                  // ✅ true on Vercel
            sameSite: isProd ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });



        res.json({ success: true, message: 'Login successful', username: admin.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.json({ success: true, message: 'Logged out' });
});

// Check Auth Status
app.get('/api/admin/verify', verifyAdmin, (req, res) => {
    res.json({ success: true, admin: req.admin });
});

// Create Admin (run once to seed)
app.post('/api/admin/create', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(403).json({ error: "Admin already exists" });
    }

    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ success: true, message: "Admin created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Admin password (temporary - remove in production)
app.post('/api/admin/reset', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    await Admin.deleteMany({});
    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ success: true, message: "Admin reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============ ANALYTICS ROUTES (Protected) ============

// Get date-wise registration stats
app.get('/api/admin/analytics/registrations', verifyAdmin, async (req, res) => {
    try {
        const stats = await Team.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get team size distribution
app.get('/api/admin/analytics/team-sizes', verifyAdmin, async (req, res) => {
    try {
        const stats = await Team.aggregate([
            {
                $group: {
                    _id: '$teamSize',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Create team
// POST - Create team (FIXED FOR NEW SCHEMA)
app.post("/api/teams", rateLimit, async (req, res) => {
    try {
        const {
            teamname,
            teamSize,
            leader,
            member1,
            member2,
            member3,
            transactionId
        } = req.body;

        if (!teamname || !teamSize || !leader || !member1 || !transactionId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existing = await Team.findOne({ teamname });
        if (existing) {
            return res.status(400).json({ error: "Team name already exists" });
        }

        // 🔥 NORMALIZER (THIS FIXES EVERYTHING)
        const normalizePerson = (p) => ({
            name: p.name,
            email: p.email,
            phone: p.phone,
            residenceType: p.type,                 // ✅ FIX
            hostelName: p.hostel || undefined,     // ✅ FIX
            wardenName: p.warden || undefined,     // ✅ FIX
            hostelContact: p.hostelContact || undefined
        });

        const teamData = {
            teamname,
            teamSize,
            leader: normalizePerson(leader),
            member1: normalizePerson(member1),
            transactionId
        };

        if (teamSize >= 3) {
            if (!member2) {
                return res.status(400).json({ error: "Member 2 required" });
            }
            teamData.member2 = normalizePerson(member2);
        }

        if (teamSize === 4) {
            if (!member3) {
                return res.status(400).json({ error: "Member 3 required" });
            }
            teamData.member3 = normalizePerson(member3);
        }

        const team = new Team(teamData);
        await team.save();

        await redis.del("teams:all");

        res.status(201).json({
            success: true,
            message: "Team registered successfully",
            data: team
        });

    } catch (err) {
        console.error("TEAM CREATE ERROR:", err);

        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: "Internal server error" });
    }
});


// GET - All teams (Protected for admin)
app.get('/api/teams', verifyAdmin, async (req, res) => {
    try {
        const cached = await redis.get('teams:all');
        if (cached) return res.json({ cached: true, data: JSON.parse(cached) });

        const teams = await Team.find().sort({ registeredAt: -1 });
        await redis.setEx('teams:all', 300, JSON.stringify(teams));
        res.json({ cached: false, data: teams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Single team (Protected)
app.get('/api/teams/:id', verifyAdmin, async (req, res) => {
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

// PUT - Update team (Protected)
app.put('/api/teams/:id', verifyAdmin, async (req, res) => {
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

// DELETE - Delete team (Protected)
app.delete('/api/teams/:id', verifyAdmin, async (req, res) => {
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
