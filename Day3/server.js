const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()

app.use(express.json())

const client = new MongoClient("mongodb://127.0.0.1:27017")

async function connectDB() {
    await client.connect()

    const db = client.db("day3db")
    const users = db.collection("users")

    // CREATE
    app.post("/users", async (req, res) => {
        const user = req.body

        await users.insertOne(user)

        res.json({
            message: "User created successfully"
        })
    })

    // READ
    app.get("/users", async (req, res) => {
        const data = await users.find().toArray()

        res.json({
            users: data
        })
    })

    // UPDATE
    app.put("/users/:id", async (req, res) => {
        const id = Number(req.params.id)

        await users.updateOne(
            { id: id },
            { $set: req.body }
        )

        res.json({
            message: "User updated successfully"
        })
    })

    // DELETE
    app.delete("/users/:id", async (req, res) => {
        const id = Number(req.params.id)

        await users.deleteOne({
            id: id
        })

        res.json({
            message: "User deleted successfully"
        })
    })

    console.log("MongoDB connected")
}

connectDB()

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000")
})