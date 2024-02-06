import createJob from "../config/queue.config.js";
import {
  WELCOME_MSG,
  ORDER_CONFIRMATION,
  PAYMENT_COMPLETE,
} from "../constants/mail.constants.js";

// { name, email }
const sendWelcome = (welcomeMailerDto) => {
  createJob(WELCOME_MSG, welcomeMailerDto);
};

// { name, orderId }
const sendOrderComplete = (orderCompleteMailerDto) => {
  createJob(ORDER_CONFIRMATION, orderCompleteMailerDto);
};

// { name, orderId, amount }
const sendPaymentComplete = (paymentCompleteMailerDto) => {
  createJob(PAYMENT_COMPLETE, paymentCompleteMailerDto);
};

export { sendWelcome, sendOrderComplete, sendPaymentComplete };
