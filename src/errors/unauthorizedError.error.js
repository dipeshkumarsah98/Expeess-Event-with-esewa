import CustomError from "./custom.error.js";

export default class UnauthorizedError extends CustomError {
  statusCode = 401;
  errorCode = "UNAUTHORIZED";

  constructor(message, details) {
    super(message);

    this.details = details;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
