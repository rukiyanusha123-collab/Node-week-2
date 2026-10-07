const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({
            message: "Token required"
        })
    }

    try {
        const decoded = jwt.verify(token, "mysecretkey")

        req.user = decoded

        next()
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = authMiddleware