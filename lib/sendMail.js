import nodemailer from "nodemailer";

export const sendEmail = async ( subject, receiver, body) => {
    const  transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false,   
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    const options = {
        from:`"Zeeshan" <${process.env.NODEMAILER_EMAIL}>`,
        to: receiver,
        subject: subject,
        html: body
    }
    try {
        await transporter.sendMail(options);
          console.log("✅ Email sent successfully")

        return {success: true};
    } catch (error) {
        console.log("❌ Email error:", error.message)

        return {success: false, message: error.message};
    }
}