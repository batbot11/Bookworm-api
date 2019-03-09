import nodemailer from "nodemailer";

const from = "'Bookworm' <info@bookworm.com>";

function setup() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS}
        })
}

export function sendConfirmationEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        text: `Welcome to Bookworm! Please confirm your email to continue.
        
        ${user.generateConfirmationURL()}
        `
    }
    transport.sendMail(email);
}
export function sendResetPasswordEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        text: `To reset password clink on the link below
        
        ${user.generateResetPasswordLink()}
        `
    }
    transport.sendMail(email);
}
