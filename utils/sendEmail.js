import nodeMailer from "nodemailer";

// Function to send email
const sendEmail = async (options) => {
    // Create a transporter using SMTP configuration
    var smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
            user: "joshilkanani112@gmail.com",
            pass: "kdqcjunmiljuvous",
        }
    };
    var transporter = nodeMailer.createTransport(smtpConfig);


    // Define email options
    const mailOptions = {
        from: "joshilkanani112@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };


    // Attempt to send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}`);

};

export default sendEmail;
