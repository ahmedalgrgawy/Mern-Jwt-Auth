import bcryptjs from "bcryptjs";
import crypto from "crypto"
import { User } from "../models/user.model.js";
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../emails/emails.js";

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

    const { email, password } = req.body;

    try {

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Data is Missing' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({ success: false, message: 'User does not exist' })
        }

        const isPassValid = await bcryptjs.compare(password, user.password)

        if (!isPassValid) {
            res.status(400).json({ success: false, message: 'Invalid Credentials' })
        }

        generateTokenSetCookie(res, user._id);

        user.lastLogin = new Date();

        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }

}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400).json({ success: false, message: 'User does not exist' })
        }

        // reset code 
        const resetCode = crypto.randomBytes(20).toString("hex");
        const resetCodeExpiresAt = Date.now() + 60 * 60 * 1000;

        user.resetPasswordToken = resetCode;
        user.resetPasswordExpiresAt = resetCodeExpiresAt;

        await user.save()

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetCode}`)

        res.status(200).json({ success: true, message: "Reset Email Sent!" })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }

}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        user.password = hashedPassword;

        user.resetPasswordExpiresAt = undefined;
        user.resetPasswordToken = undefined;

        await user.save()

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password Reset successfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }

}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        success: true,
        message: "Logged out Successfully",
    })
}