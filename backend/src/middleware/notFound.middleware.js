/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Resource Not Found - ${req.originalUrl}`,
  });
};

export default notFoundHandler;
