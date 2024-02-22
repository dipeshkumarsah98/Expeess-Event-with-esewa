import errorResponse from "../utils/errorResponse.js";
import CustomError from "../errors/custom.error.js";

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .json(errorResponse(error.message, error.statusCode));
  }

  return res
    .status(500)
    .json(
      errorResponse(
        "INTERNAL_SERVER_ERROR",
        "Internal Server Error",
        "An unexpected error occurred"
      )
    );
};

export default errorHandler;
