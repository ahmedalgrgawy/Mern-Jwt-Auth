import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { mailtrapClient, recipients, sender } from "./mailtrap.config.js"


export const sendVerificationEmail = async (email, verificationToken) => {


    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log(email, res);

    } catch (error) {
        console.log(error);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Welcome Email",
            template_uuid: "30f420f2-c61c-4442-9e00-ad4a6a7b2e34",
            template_variables: {
                "company_info_name": "Greg Company",
                "name": name
            },
        })

        console.log(name, res);

    } catch (error) {
        console.log(error);
        throw new Error(`Error sending Welcome email: ${error}`);
    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipients,
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "password reset",
            subject: "Password Reset Email"
        })

        console.log(email, res);

    } catch (error) {
        console.log(error);
        throw new Error(`Error sending Password Reset: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipients,
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "password reset",
            subject: "Success Password Reset Email"
        })

        console.log(email, res);

    } catch (error) {
        console.log(error);
        throw new Error(`Error Resetting Password: ${error}`);
    }
}