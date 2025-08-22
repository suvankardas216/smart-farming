import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per IP per window
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
});

// Optional: stricter limiter for sensitive routes (login, register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // max 10 login/register attempts per IP
    message: "Too many login attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

