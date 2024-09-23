import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized, Token is empty" })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            res.status(401).json({ success: false, message: "Unauthorized, Token is Invalid" })
        }

        req.userId = decoded.userId;

        next()

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }

}