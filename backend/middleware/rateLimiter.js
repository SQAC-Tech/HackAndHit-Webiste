import { redisClient } from '../config/redis.js';

const rateLimiter = (options = {}) => {
    const {
        windowMs = 60 * 1000,   // 1 minute window
        maxRequests = 10,       // max requests per window
        keyPrefix = 'rl:'       // redis key prefix
    } = options;

    return async (req, res, next) => {
        try {
            const ip = req.ip || req.connection.remoteAddress;
            const key = `${keyPrefix}${ip}`;

            const requests = await redisClient.incr(key);

            if (requests === 1) {
                await redisClient.expire(key, Math.ceil(windowMs / 1000));
            }

            const ttl = await redisClient.ttl(key);

            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requests));
            res.setHeader('X-RateLimit-Reset', Date.now() + (ttl * 1000));

            if (requests > maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many requests. Please try again later.',
                    retryAfter: ttl
                });
            }

            next();
        } catch (error) {
            console.error('Rate limiter error:', error);
            // If Redis fails, allow the request to proceed
            next();
        }
    };
};

export default rateLimiter;
