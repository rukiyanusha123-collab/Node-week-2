const express = require("express")

const app = express()

// Middleware to read JSON data
app.use(express.json())

// Users array
let users = [
    {
        id: 1,
        name: "Rukiya",
        email: "rukiya@gmail.com"
    },
    {
        id: 2,
        name: "Aksa",
        email: "aksa@gmail.com"
    }
]

// POST /users - Create user
app.post("/users", (req, res) => {
    const { name, email } = req.body

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email
    }

    users.push(newUser)

    res.status(201).json({
        message: "User created successfully",
        user: newUser
    })
})

// GET /users - Get all users
app.get("/", (req, res) => {
    res.json({
        message: "Users fetched successfully",
        users: users
    })
})

// GET /users/:id - Get specific user
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id)

    const user = users.find(user => user.id === id)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.json({
        message: "User fetched successfully",
        user: user
    })
})

// PUT /users/:id - Update user
app.put("/users/:id", (req, res) => {
    const id = Number(req.params.id)

    const user = users.find(user => user.id === id)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const { name, email } = req.body

    user.name = name
    user.email = email

    res.json({
        message: "User updated successfully",
        user: user
    })
})

// DELETE /users/:id - Delete user
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id)

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const deletedUser = users.splice(userIndex, 1)

    res.json({
        message: "User deleted successfully",
        user: deletedUser[0]
    })
})

// Start server
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000")
})