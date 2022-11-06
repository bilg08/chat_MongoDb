const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") err.message = "Энэ id буруу байна";
  err.statusCode = 400;

  res.status(err.statusCode || 500).json({
    success: false,
    error: err,
  });
};
module.exports = errorHandler;
