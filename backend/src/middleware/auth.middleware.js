const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const { getCurrentUser } = require('../services/auth.service');

// Protect middleware: verifies JWT and loads user onto request
const protect = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		} else if (req.cookies && req.cookies.token) {
			token = req.cookies.token;
		}

		if (!token) {
			return next(new AppError('Not authorized, token missing', 401));
		}

		const payload = verifyToken(token);
		if (!payload || !payload.id) {
			return next(new AppError('Invalid or expired token', 401));
		}

		const user = await getCurrentUser(payload.id);
		req.user = user;
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = { protect };

