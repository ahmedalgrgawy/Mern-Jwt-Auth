import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../emails/emails.js";

export const signup = async (req, res) => {

    const { email, password, name } = req.body;

    try {

        if (!email || !password || !name) {
            throw new Error('Data is Missing')
        }

        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({ success: false, message: "User Already Exist" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7days
        })

        await user.save();

        // jwt 
        generateTokenSetCookie(res, user._id)

        // send mail
        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true, message: "User Created Successfully", user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {

    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired code" })
        }

        user.isVerified = true;

        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined

        await user.save()

        await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }
}

export const login = async (req, res) => {
    res.send('login router')
}

export const logout = async (req, res) => {
    res.send('logout router')
}