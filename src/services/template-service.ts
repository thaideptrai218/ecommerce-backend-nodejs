import templateModel from "../models/template-model";

export const newTemplate = async ({ tem_name, tem_html }) => {
    //1. Check if exists
    const isExist = await templateModel.findOne({ tem_name });
    if (isExist) return isExist;

    //2 create a new template
    const newTem = await templateModel.create({
        tem_name, //unique name
        tem_html,
    });

    return newTem;
};

export const getTemplate = async ({ tem_name }) => {
    const template = await templateModel.findOne({
        tem_name,
    });

    if (!template) {
        return createOtpTemplate();
    }

    return template;
};

export const createOtpTemplate = async () => {
    const html = htmlEmailToken();
    return await newTemplate({
        tem_name: "HTML EMAIL OTP",
        tem_html: html,
    });
};

const htmlEmailToken = () => {

    return `

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>OTP Verification</title>

        </head>

        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

                <h2 style="color: #333333; text-align: center;">Welcome to {{shop_name}}!</h2>

                <p style="font-size: 16px; color: #555555;">Hello {{user_name}},</p>

                <p style="font-size: 16px; color: #555555;">Thank you for registering. Please click the button below to verify your email address:</p>

                

                <div style="text-align: center; margin: 30px 0;">

                    <a href="{{verify_link}}" style="background-color: #007BFF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; display: inline-block;">Verify Email</a>

                </div>



                <p style="font-size: 16px; color: #555555;">Or copy and paste this link into your browser:</p>

                <p style="font-size: 14px; color: #007BFF; word-break: break-all;">{{verify_link}}</p>



                <p style="font-size: 14px; color: #999999; margin-top: 30px; text-align: center;">This link will expire in 1 minute. If you didn't request this, please ignore this email.</p>

            </div>

        </body>

        </html>

    `;

}

;
