import CustomError from "./custom.error.js";

export default class NotFoundError extends CustomError {
  statusCode = 404;
  errorCode = "NOT_FOUND";

  constructor(message, details) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
