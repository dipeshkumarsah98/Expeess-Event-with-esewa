import NotFoundError from "../errors/notFoundError.error.js";

const notFoundHandler = (req, res) => {
  throw new NotFoundError(
    "Invalid route",
    "We're sorry, but the requested API route does not exist. Please check the URL you provided and ensure it corresponds to a valid endpoint. If you believe this is an error, please review the API documentation for the correct routes or contact our support team for further assistance.Thank you for your understanding"
  );
};

export default notFoundHandler;
