const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")

const User = require("./models/User")
const authMiddleware = require("./middleware/authMiddleware")

const app = express()

app.use(express.json())


// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
    res.send("Day 6 User Management App is running")
})


// =========================
// MONGODB CONNECTION
// =========================

mongoose.connect("mongodb://127.0.0.1:27017/day6db")
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error)
    })


// =========================
// MULTER
// =========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }

})

const upload = multer({
    storage: storage
})


// =========================
// REGISTER ADMIN
// =========================

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body

        const existingUser = await User.findOne({
            email: email
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        )

        const user = await User.create({

            name: name,
            email: email,
            password: hashedPassword,
            role: "admin"

        })

        res.status(201).json({

            message: "Admin registered successfully",
            user: user

        })

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        })

    }

})


// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {

    try {

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
                email: user.email,
                role: user.role
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

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        })

    }

})


// =========================
// CREATE USER
// =========================

app.post(
    "/users",
    authMiddleware,
    upload.single("photo"),
    async (req, res) => {

        try {

            const {
                name,
                email,
                username
            } = req.body

            const user = await User.create({

                name: name,
                email: email,
                username: username,

                photo: req.file
                    ? req.file.filename
                    : null,

                role: "user"

            })

            res.status(201).json({

                message: "User created successfully",
                user: user

            })

        } catch (error) {

            res.status(500).json({
                message: "User creation failed",
                error: error.message
            })

        }

    }
)


// =========================
// GET ALL USERS
// =========================

app.get(
    "/users",
    authMiddleware,
    async (req, res) => {

        try {

            const users = await User.find()

            res.json({
                users: users
            })

        } catch (error) {

            res.status(500).json({
                message: "Failed to get users",
                error: error.message
            })

        }

    }
)


// =========================
// GET SINGLE USER
// =========================

app.get(
    "/users/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const user = await User.findById(
                req.params.id
            )

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                })

            }

            res.json({
                user: user
            })

        } catch (error) {

            res.status(500).json({
                message: "Failed to get user",
                error: error.message
            })

        }

    }
)


// =========================
// UPDATE USER
// =========================

app.put(
    "/users/:id",
    authMiddleware,
    upload.single("photo"),
    async (req, res) => {

        try {

            const updateData = {

                name: req.body.name,
                email: req.body.email,
                username: req.body.username

            }

            if (req.file) {

                updateData.photo =
                    req.file.filename

            }

            const user =
                await User.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true
                    }

                )

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                })

            }

            res.json({

                message: "User updated successfully",
                user: user

            })

        } catch (error) {

            res.status(500).json({
                message: "Update failed",
                error: error.message
            })

        }

    }
)


// =========================
// DELETE USER
// =========================

app.delete(
    "/users/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findByIdAndDelete(
                    req.params.id
                )

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                })

            }

            res.json({

                message: "User deleted successfully"

            })

        } catch (error) {

            res.status(500).json({
                message: "Delete failed",
                error: error.message
            })

        }

    }
)


// =========================
// START SERVER
// =========================

app.listen(4000, () => {

    console.log(
        "Server running on http://localhost:4000"
    )

})