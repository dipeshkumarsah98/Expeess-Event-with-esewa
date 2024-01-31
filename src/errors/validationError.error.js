import CustomError from "./custom.error.js";

export default class ValidationError extends CustomError {
  statusCode = 400;
  errorCode = "BAD_REQUEST";

  constructor(message, details) {
    super(message);

    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
