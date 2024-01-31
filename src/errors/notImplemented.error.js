import CustomError from "./custom.error.js";

export default class NotImplementedError extends CustomError {
  statusCode = 501;
  errorCode = "NOT_IMPLEMENTED";

  constructor(message, details) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}
