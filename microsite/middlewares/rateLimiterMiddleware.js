import {slowDown} from 'express-slow-down';

const rateLimitTimeWindow = parseInt(process.env.RATELIMIT_TIMEWINDOW) || 10 * 60 * 1000;
const rateLimitReqCount = parseInt(process.env.RATELIMIT_REQ_COUNT) || 500;

const customKeyGenerator = req => {
	const ip = req.ip || req.socket.remoteAddress;
	if (!ip) {
		console.error('Warning: request IP is missing!');
	}
	return ip ? ip.replace(/:\d+[^:]*$/, '') : null;
};

export const slowLimiter = slowDown({
	windowMs: rateLimitTimeWindow, // 10 minutes
	delayAfter: rateLimitReqCount, // Allow 500 requests per 10 minutes.
	delayMs: hits => Math.max(hits - rateLimitReqCount) * 100, // Add 100 ms of delay to every request after the 500th one.
	keyGenerator: customKeyGenerator,
});

export const logRateLimitExceedance = (req, res, next) => {
	const {used, limit} = req.slowDown || {};
	if (used && limit && used > limit && (used - limit) % 10 === 1) {
		console.log('Exceeded rate limit for IP', req.ip || req.socket.remoteAddress, ' Currently used:', used, ' Limit:', limit);
	}
	next();
};
