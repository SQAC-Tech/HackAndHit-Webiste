import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import connectDB from './model/db.js';
import Team from './model/schema.js';
import Admin from './model/adminSchema.js';
import transporter from "./mailer.js";

dotenv.config();

const app = express();

/* 🔥 REQUIRED FOR RENDER / VERCEL COOKIE AUTH */
app.set("trust proxy", 1);

const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key_2024';

// ================= REDIS =================
const redis = createClient({
    url: process.env.REDIS_URL,
    socket: { tls: true }
});

redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('connect', () => console.log('Redis connected'));

// ================= MIDDLEWARE =================
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
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ================= AUTH MIDDLEWARE =================
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

// ================= RATE LIMIT =================
const rateLimit = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate:${ip}`;
    const count = await redis.incr(key);

    if (count === 1) await redis.expire(key, 60);
    if (count > 20) {
        return res.status(429).json({ error: 'Too many requests' });
    }

    next();
};

// ================= INIT =================
connectDB();
redis.connect();

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get("/api/teamleader-basic", async (req, res) => {
  try {
    const cached = await redis.get("teams:basic");

    if (cached) {
      return res.json({ cached: true, data: JSON.parse(cached) });
    }

    const teams = await Team.find()
      .select("teamname leader.name leader.phone leader.email -_id")
      .sort({ registeredAt: -1 });

    await redis.setEx("teams:basic", 300, JSON.stringify(teams));

    res.json({ cached: false, data: teams });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= ADMIN AUTH =================
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/logout', (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.json({ success: true, message: "Logged out" });
});

app.get('/api/admin/verify', verifyAdmin, (req, res) => {
    res.json({ success: true, admin: req.admin });
});

// ================= ANALYTICS =================
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

app.get('/api/admin/analytics/team-sizes', verifyAdmin, async (req, res) => {
    try {
        const stats = await Team.aggregate([
            { $group: { _id: '$teamSize', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= TEAM ROUTES =================
app.post('/api/teams', rateLimit, async (req, res) => {
    try {
        const { teamname, teamSize, leader, member1, member2, member3, transactionId } = req.body;

        if (!teamname || !teamSize || !leader || !member1 || !transactionId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const exists = await Team.findOne({ teamname });
        if (exists) {
            return res.status(400).json({ error: "Team name already exists" });
        }

        const normalize = (p) => ({
            name: p.name,
            email: p.email,
            phone: p.phone,
            residenceType: p.type,
            hostelName: p.hostel || undefined,
            wardenName: p.warden || undefined,
            hostelContact: p.hostelContact || undefined
        });

        const team = new Team({
            teamname,
            teamSize,
            leader: normalize(leader),
            member1: normalize(member1),
            member2: teamSize >= 3 ? normalize(member2) : undefined,
            member3: teamSize === 4 ? normalize(member3) : undefined,
            transactionId
        });

        await team.save();
        await redis.del("teams:all");

        res.status(201).json({ success: true, data: team });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/teams', verifyAdmin, async (req, res) => {
    try {
        const cached = await redis.get("teams:all");
        if (cached) {
            return res.json({ cached: true, data: JSON.parse(cached) });
        }

        const teams = await Team.find().sort({ registeredAt: -1 });
        await redis.setEx("teams:all", 300, JSON.stringify(teams));

        res.json({ cached: false, data: teams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/teams/:id', verifyAdmin, async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!team) return res.status(404).json({ error: "Team not found" });

        await redis.del("teams:all");
        await redis.del(`teams:${req.params.id}`);

        res.json({ success: true, data: team });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/teams/:id', verifyAdmin, async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) return res.status(404).json({ error: "Team not found" });

        await redis.del("teams:all");
        await redis.del(`teams:${req.params.id}`);

        res.json({ success: true, message: "Team deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch("/api/ppt-submit", async (req, res) => {
    try {
        const { email, pptLink } = req.body;

        if (!email || !pptLink) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const team = await Team.findOneAndUpdate(
            { "leader.email": email },
            {
                pptSubmitted: true,
                pptLink: pptLink
            },
            { new: true }
        );

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // 🔥 VERY IMPORTANT (because of Redis cache)
        await redis.del("teams:all");
        await redis.del("teams:basic");

        res.json({ success: true, data: team });
    } catch (err) {
        console.error("PPT submit error:", err);
        res.status(500).json({ error: "PPT submission failed" });
    }
});


//mass mailer

app.post("/api/mass-mail", async (req, res) => {
  try {
    const { subject, message, mode, testEmail, ccEmails, bccEmails } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        error: "Subject and message required",
      });
    }

    // =======================
    // 🧪 MODE 1: SINGLE TEST
    // =======================
    if (mode === "test") {
      console.warn("🧪 MODE: SINGLE TEST");

      if (!testEmail) {
        return res.status(400).json({
          error: "testEmail is required in test mode",
        });
      }

      await transporter.sendMail({
        from: `"Hack & Hit" <${process.env.SMTP_USER}>`,
        to: testEmail,
        subject: `[TEST] ${subject}`,
        html: `<p>${message}</p>`,
      });

      return res.json({
        success: true,
        mode,
        sentCount: 1,
        sent: [testEmail],
        failed: [],
      });
    }

    // =======================
    // 🧪 MODE 2: CC / BCC TEST
    // =======================
    if (mode === "cc-bcc-test") {
      console.warn("🧪 MODE: CC / BCC TEST");

      const testTo = "akasharmaraghav@gmail.com";
      const testCc = "akasharmaraghav+cc@gmail.com";
      const testBcc = "akasharmaraghav+bcc@gmail.com";

      await transporter.sendMail({
        from: `"Hack & Hit" <${process.env.SMTP_USER}>`,
        to: testTo,
        cc: [testCc],
        bcc: [testBcc],
        subject: `[CC/BCC TEST] ${subject}`,
        html: `<p>${message}</p>`,
      });

      return res.json({
        success: true,
        mode,
        sentCount: 3,
        sent: [testTo, testCc, testBcc],
        failed: [],
      });
    }

    // =======================
    // 🚨 MODE 3: LIVE MASS MAIL (WITH CC/BCC)
    // =======================
    if (mode === "live") {
      console.warn("🚨 MODE: LIVE MASS MAIL");

      const teams = await Team.find()
        .select("leader.email -_id")
        .lean();

      const recipients = teams
        .map(t => t.leader?.email)
        .filter(Boolean);

      if (!recipients.length) {
        return res.status(400).json({
          error: "No recipients found",
        });
      }

      // ✅ Normalize CC & BCC (optional)
      const ccList = ccEmails
        ? Array.isArray(ccEmails) ? ccEmails : [ccEmails]
        : [];

      const bccList = bccEmails
        ? Array.isArray(bccEmails) ? bccEmails : [bccEmails]
        : [];

      const sent = [];
      const failed = [];

      // 🔁 SEND ONE BY ONE (FAILURE SAFE)
      for (const email of recipients) {
        try {
          await transporter.sendMail({
            from: `"Hack & Hit" <${process.env.SMTP_USER}>`,
            to: email,
            cc: ccList.length ? ccList : undefined,
            bcc: bccList.length ? bccList : undefined,
            subject,
            html: `<p>${message}</p>`,
          });

          sent.push(email);
        } catch (err) {
          console.error("❌ Mail failed for:", email);
          failed.push(email);
        }
      }

      // ✅ UPDATE DB ONLY FOR SUCCESSFUL MAILS
      if (sent.length > 0) {
        await Team.updateMany(
          { "leader.email": { $in: sent } },
          { $set: { mailSent: true } }
        );
      }

      return res.json({
        success: true,
        mode,
        total: recipients.length,
        sentCount: sent.length,
        failedCount: failed.length,
        cc: ccList,
        bcc: bccList,
        sent,
        failed,
      });
    }

    // =======================
    // ❌ INVALID MODE
    // =======================
    return res.status(400).json({
      error: "Invalid mode. Use test | cc-bcc-test | live",
    });

  } catch (err) {
    console.error("Mass mail error:", err);
    res.status(500).json({
      error: "Mail sending failed",
    });
  }
});


//rounds 
app.patch("/api/teams/:id/round", verifyAdmin, async (req, res) => {
    try {
        const { round } = req.body;

        if (!["round1", "round2", "round3"].includes(round)) {
            return res.status(400).json({ error: "Invalid round" });
        }

        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        if (team[round]) {
            return res.status(400).json({ error: "Already marked" });
        }

        team[round] = true;
        await team.save();

        // 🔥 CRITICAL FIX — CLEAR REDIS CACHE
        await redis.del("teams:all");
        await redis.del("teams:basic");

        res.json({ success: true, updatedRound: round });
    } catch (err) {
        console.error("Round update error:", err);
        res.status(500).json({ error: "Round update failed" });
    }
});




// ================= START =================
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


