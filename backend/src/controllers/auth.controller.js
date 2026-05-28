const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { registerUser, loginUser } = require('../services/auth.service');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

const register = catchAsync(async (req, res) => {
  const { isValid, errors } = validateRegister(req.body);
  if (!isValid) {
    throw new AppError(errors.join(', '), 400);
  }

  const { user, token } = await registerUser(req.body);
  res.status(201).json({
    success: true,
    data: {
      user,
      token
    }
  });
});

const login = catchAsync(async (req, res) => {
  const { isValid, errors } = validateLogin(req.body);
  if (!isValid) {
    throw new AppError(errors.join(', '), 400);
  }

  const { user, token } = await loginUser(req.body.email, req.body.password);
  res.status(200).json({
    success: true,
    data: {
      user,
      token
    }
  });
});

module.exports = {
  register,
  login
};
