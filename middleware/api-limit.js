const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 2, // Allow only 2 requests per 10 seconds
    keyGenerator: (req) => req.body.email || req.ip, // Use email if available, otherwise fallback to IP
    message: { error: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.log(`Rate limit exceeded for user: ${req.body.email || req.ip}`);
        res.status(429).json({ error: "Too many login attempts. Please try again later." });
    }
});

 module.exports.apiLimiter = apiLimiter