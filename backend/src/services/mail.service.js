import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "../emailTemplates");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  DEV_SMTP_HOST,
  DEV_SMTP_PORT,
  DEV_SMTP_USER,
  DEV_SMTP_PASS,
  DEV_SMTP_FROM,
  NODE_ENV,
} = process.env;

const hbsOptions = {
  viewEngine: {
    extname: ".handlebars",
    partialsDir: templatePath,
    defaultLayout: false,
  },
  viewPath: templatePath,
  extName: ".handlebars",
};

let transporter;

if (NODE_ENV === "development") {
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: DEV_SMTP_HOST || testAccount.smtp.host,
    port: DEV_SMTP_PORT || testAccount.smtp.port,
    secure: false,
    auth: {
      user: DEV_SMTP_USER || testAccount.user,
      pass: DEV_SMTP_PASS || testAccount.pass,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT) : 587,
    secure: SMTP_PORT == 465 ? true : false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

transporter.use("compile", hbs(hbsOptions));

/**
 * Sends an email using nodemailer
 * @param {string} to - recipient email address
 * @param {string} subject - subject line of the email
 * @param {string} template - name of the email template to use
 * @param {Object} context - context to pass to the email template
 */
async function sendMail({ to, subject, template, context }) {
  try {
    const info = await transporter.sendMail({
      from: NODE_ENV === "development" ? DEV_SMTP_FROM : SMTP_FROM,
      to,
      subject,
      template,
      context,
    });

    logger.info("Message sent: " + JSON.stringify(info, null, 2));

    if (NODE_ENV === "development") {
      logger.info("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    logger.error("Error sending email: " + err.message);
    throw err;
  }
}

export default sendMail;
