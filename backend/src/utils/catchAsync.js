/**
 * Wrapper function to eliminate try-catch blocks in controllers
 * Automatically catches errors and passes them to error handling middleware
 * 
 * @param {Function} fn - Async controller function
 * @returns {Function} - Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;