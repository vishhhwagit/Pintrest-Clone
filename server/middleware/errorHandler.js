export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
