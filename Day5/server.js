const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("./models/User")
const authMiddleware = require("./middleware/authMiddleware")

const app = express()

app.use(express.json())

// ==================== HOME ROUTE ====================

app.get("/", (req, res) => {
    res.send("Day 5 Authentication Server is running")
})

// ==================== MONGODB CONNECTION ====================

mongoose.connect("mongodb://127.0.0.1:27017/day5db")
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch((error) => {
        console.log(error)
    })


// ==================== REGISTER ====================

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    res.status(201).json({
        message: "User registered successfully",
        user: user
    })
})


// ==================== LOGIN ====================

app.post("/login", async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({
        email: email
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    )

    if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        "mysecretkey",
        {
            expiresIn: "1h"
        }
    )

    res.json({
        message: "Login successful",
        token: token
    })
})


// ==================== PROTECTED PROFILE ====================

app.get("/profile", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId)

    res.json({
        message: "Profile accessed successfully",
        user: user
    })
})


// ==================== START SERVER ====================

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000")
})