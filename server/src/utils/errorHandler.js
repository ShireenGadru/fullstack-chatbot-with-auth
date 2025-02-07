import ApiError from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err); // Logs for debugging
  const statusCode = err.statusCode || 500;
  if (err instanceof ApiError) {
    const response = {
      success: false,
      statusCode,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
    };

    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
