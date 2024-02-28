import createJob from "../config/queue.config.js";
import {
  WELCOME_MSG,
  ORDER_CONFIRMATION,
  PAYMENT_COMPLETE,
  SEND_RESULT,
} from "../constants/mail.constants.js";

// { name, email }
const sendWelcome = (welcomeMailerDto) => {
  createJob(WELCOME_MSG, welcomeMailerDto);
};

const sendResult = (resultMailerDto) => {
  createJob(SEND_RESULT, resultMailerDto);
};

// { name, orderId }
const sendOrderComplete = (orderCompleteMailerDto) => {
  createJob(ORDER_CONFIRMATION, orderCompleteMailerDto);
};

// { name, orderId, amount }
const sendPaymentComplete = (paymentCompleteMailerDto) => {
  createJob(PAYMENT_COMPLETE, paymentCompleteMailerDto);
};

export { sendWelcome, sendOrderComplete, sendPaymentComplete, sendResult };
