import nodemailer from "nodemailer";

const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const config = {
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
};

const mailer = nodemailer.createTransport(config);

export default mailer;
