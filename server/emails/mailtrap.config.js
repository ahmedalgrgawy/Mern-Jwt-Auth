import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config()


export const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.com",
    name: "Ahmed Algrgawy",
};

export const recipients = [
    {
        email: "ahmedalgrgawy10@gmail.com",
    }
];