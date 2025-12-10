import type Mail from "nodemailer/lib/mailer";
import { newOtp } from "./otp-service";
import { getTemplate } from "./template-service";
import { transport } from "../configs/nodemailer-config";

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = "Verify Registration Email",
    text = "VERIFY",
}) => {
    const mailOptions: Mail.Options = {
        from: '"ShopDEV" <anonystick@gmail.com>',
        to: toEmail,
        subject,
        text,
        html,
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log("Message sent", info.messageId);
        return info;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const sendEmailToken = async ({
    email = null,
    userName = "User", // Default name if not provided
    shopName = "ShopDEV", // Default shop name
}) => {
    try {
        //1. get a token
        const token = await newOtp({
            email,
        });

        //2. Get template
        const template = await getTemplate({
            tem_name: "HTML EMAIL OTP",
        });

        if (!template) {
            return console.log("Template not found");
        }

        //3. Replace placeholder
        // Construct the verification link
        // Ideally, the base URL should come from an environment variable (e.g., process.env.FRONTEND_URL)
        const verifyLink = `http://localhost:3000/verify?token=${token.otp_token}&email=${email}`;

        const content = template.tem_html
            .replace("{{verify_link}}", verifyLink) // Replace in Button
            .replace("{{verify_link}}", verifyLink) // Replace in plain text backup
            .replace("{{user_name}}", userName)
            .replace("{{shop_name}}", shopName);

        //4. Send email
        await sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: `Welcome to ${shopName} - Please Verify Your Email`,
        });

        return 1;
    } catch (error) {
        console.error(error);
    }
};

