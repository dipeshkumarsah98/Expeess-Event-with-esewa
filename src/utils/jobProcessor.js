import mailer from "../config/mailer.config.js";
import {
  sendWelcomeTemplate,
  sendPaymentCompleteTemplate,
  sendOrderCompleteTemplate,
} from "./emailTemplate.js";

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const APP_NAME = process.env.APP_NAME;

const processPaymentCompleteJob = async (job) => {
  try {
    console.log(`Sending payment confirmation email to '${job.data.email}'`);

    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `Payment Confirmation for Order ID: ${job.data.orderId}`,
      html: sendPaymentCompleteTemplate(job.data),
    };
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(
      `Failed to send payment confirmation mail to '${job.data.email}'`
    );
  }
};

const processOrderCompleteJob = async (job) => {
  try {
    console.log(`Sending order confirmation email to '${job.data.email}'`);

    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `Givewary confirmation PHASEZERO`,
      html: sendOrderCompleteTemplate(job.data),
    };
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(
      `Failed to send order confirmation mail to '${job.data.email}'`
    );
  }
};

const processWelcomeJob = async (job) => {
  try {
    console.log(`Sending welcome email to '${job.data.email}'`);

    const message = {
      from: EMAIL_ADDRESS,
      to: job.data.email,
      subject: `Welcome to ${APP_NAME}`,
      html: sendWelcomeTemplate(job.data),
    };
    return await mailer.sendMail(message);
  } catch (error) {
    console.log(`Failed to send welcome mail to '${job.data.email}'`);
  }
};

export {
  processWelcomeJob,
  processPaymentCompleteJob,
  processOrderCompleteJob,
};
