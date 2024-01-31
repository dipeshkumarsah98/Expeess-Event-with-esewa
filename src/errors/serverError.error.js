import CustomError from "./custom.error.js";

export default class ServerError extends CustomError {
  statusCode = 500;
  errorCode = "INTERNAL_SERVER_ERROR";

  constructor(message, details) {
    super(message);

    this.details = details;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
