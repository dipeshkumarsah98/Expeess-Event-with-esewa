const errorResponse = (message, status) => ({
  success: false,
  status: status || 500,
  message,
});

export default errorResponse;
