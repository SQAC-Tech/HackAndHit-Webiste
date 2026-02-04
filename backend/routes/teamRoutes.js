import express from 'express';
import Team from '../model/schema.js';
import { redisClient } from '../config/redis.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

const CACHE_EXPIRY = 300; // 5 minutes

// Helper function to clear team cache
const clearTeamCache = async () => {
    try {
        const keys = await redisClient.keys('teams:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error('Cache clear error:', error);
    }
};

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is up and running',
        timestamp: new Date().toISOString()
    });
});

// POST - Create a new team
router.post('/teams', rateLimiter({ maxRequests: 5, windowMs: 60000 }), async (req, res) => {
    try {
        const {
            teamname, teamSize,
            leadername, leaderemail, leaderphone,
            member1name, member1email, member1phone,
            member2name, member2email, member2phone,
            member3name, member3email, member3phone
        } = req.body;

        // Check if team already exists
        const existingTeam = await Team.findOne({ teamname });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team name already exists'
            });
        }

        const teamData = {
            teamname,
            teamSize: teamSize || 1,
            leader: {
                name: leadername,
                email: leaderemail,
                phone: leaderphone
            }
        };

        // Add members based on team size
        if (teamSize >= 2 && member1name) {
            teamData.member1 = {
                name: member1name,
                email: member1email,
                phone: member1phone
            };
        }
        if (teamSize >= 3 && member2name) {
            teamData.member2 = {
                name: member2name,
                email: member2email,
                phone: member2phone
            };
        }
        if (teamSize >= 4 && member3name) {
            teamData.member3 = {
                name: member3name,
                email: member3email,
                phone: member3phone
            };
        }

        const team = new Team(teamData);
        await team.save();

        // Clear cache after creating new team
        await clearTeamCache();

        res.status(201).json({
            success: true,
            message: 'Team registered successfully',
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating team',
            error: error.message
        });
    }
});

// GET - Get all teams with pagination
router.get('/teams', rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const cacheKey = `teams:all:${page}:${limit}`;

        // Check cache first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                cached: true,
                ...JSON.parse(cachedData)
            });
        }

        const teams = await Team.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Team.countDocuments();

        const responseData = {
            data: teams,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTeams: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };

        // Cache the result
        await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(responseData));

        res.status(200).json({
            success: true,
            cached: false,
            ...responseData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teams',
            error: error.message
        });
    }
});

// GET - Get single team by ID
router.get('/teams/:id', rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `teams:${id}`;

        // Check cache first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                cached: true,
                data: JSON.parse(cachedData)
            });
        }

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Cache the result
        await redisClient.setEx(cacheKey, CACHE_EXPIRY, JSON.stringify(team));

        res.status(200).json({
            success: true,
            cached: false,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching team',
            error: error.message
        });
    }
});

// PUT - Update team by ID
router.put('/teams/:id', rateLimiter({ maxRequests: 10, windowMs: 60000 }), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            teamname, teamSize,
            leadername, leaderemail, leaderphone,
            member1name, member1email, member1phone,
            member2name, member2email, member2phone,
            member3name, member3email, member3phone
        } = req.body;

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if new team name conflicts with existing team
        if (teamname && teamname !== team.teamname) {
            const existingTeam = await Team.findOne({ teamname });
            if (existingTeam) {
                return res.status(400).json({
                    success: false,
                    message: 'Team name already exists'
                });
            }
        }

        // Update fields
        if (teamname) team.teamname = teamname;
        if (teamSize) team.teamSize = teamSize;

        if (leadername || leaderemail || leaderphone) {
            team.leader = {
                name: leadername || team.leader.name,
                email: leaderemail || team.leader.email,
                phone: leaderphone || team.leader.phone
            };
        }

        // Update members
        if (teamSize >= 2) {
            team.member1 = {
                name: member1name || team.member1?.name,
                email: member1email || team.member1?.email,
                phone: member1phone || team.member1?.phone
            };
        }
        if (teamSize >= 3) {
            team.member2 = {
                name: member2name || team.member2?.name,
                email: member2email || team.member2?.email,
                phone: member2phone || team.member2?.phone
            };
        }
        if (teamSize >= 4) {
            team.member3 = {
                name: member3name || team.member3?.name,
                email: member3email || team.member3?.email,
                phone: member3phone || team.member3?.phone
            };
        }

        await team.save();

        // Clear cache
        await clearTeamCache();

        res.status(200).json({
            success: true,
            message: 'Team updated successfully',
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating team',
            error: error.message
        });
    }
});

// DELETE - Delete team by ID
router.delete('/teams/:id', rateLimiter({ maxRequests: 5, windowMs: 60000 }), async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findByIdAndDelete(id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Clear cache
        await clearTeamCache();

        res.status(200).json({
            success: true,
            message: 'Team deleted successfully',
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting team',
            error: error.message
        });
    }
});

export default router;
