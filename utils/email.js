const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create transporter
    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // })
    console.log(options)
    console.log(process.env.EMAIL, process.env.PASSWORD)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
      });

    // 2) Define email options
    const mailOptions = {
        from: 'forgotPassword bot <admin@social.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    // 3) send email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;