const express = require("express")
const mongoose = require("mongoose")

const User = require("./models/User")
const Post = require("./models/Post")

const app = express()

app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/day4db")
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch((error) => {
        console.log(error)
    })


// ==================== USER CRUD ====================

// CREATE USER
app.post("/users", async (req, res) => {
    const user = await User.create(req.body)

    res.status(201).json({
        message: "User created successfully",
        user: user
    })
})


// READ USERS
app.get("/users", async (req, res) => {
    const users = await User.find()

    res.json({
        users: users
    })
})


// UPDATE USER
app.put("/users/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.json({
        message: "User updated successfully",
        user: user
    })
})


// DELETE USER
app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id)

    res.json({
        message: "User deleted successfully"
    })
})


// ==================== POST + POPULATE ====================

// CREATE POST
app.post("/posts", async (req, res) => {
    const post = await Post.create(req.body)

    res.status(201).json({
        message: "Post created successfully",
        post: post
    })
})


// GET POSTS WITH USER DETAILS
app.get("/posts", async (req, res) => {
    const posts = await Post.find().populate("user")

    res.json({
        posts: posts
    })
})


// START SERVER
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000")
})