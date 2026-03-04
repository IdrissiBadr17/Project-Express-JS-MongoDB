import nodemailer from "nodemailer";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.fullName.split(" ")[0];
    this.url = url;
    this.from = `Admin < ${process.env.EMAIL_FROM} >`;
  }

  createTransport() {
    if (process.env.NODE_ENV === "production") {
      // Use a real email service in production (e.g., SendGrid, Mailgun)
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a template (e.g., using Pug or Handlebars)
    const html = `<p>Hi ${this.firstName},</p><p>${template}</p><p>Click <a href="${this.url}">here</a> to proceed.</p>`;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: template,
    };

    // 3) Create a transport and send email
    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "Welcome to the Natours family! We're excited to have you on board.",
      "Welcome to Natours!",
    );
  }

  async sendPasswordReset() {
    await this.send(
      `You requested a password reset. Please click the following link to reset your password: ${this.url}`,
      "Password Reset Request",
    );
  }
}

// export const sendEmail = async (options) => {
//   // 1- Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // 2- Define the email options
//   const mailOptions = {
//     from: `Admin <${options.email}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   // 3- Send the email
//   await transporter.sendMail(mailOptions);
// };
