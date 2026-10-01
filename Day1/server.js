const express = require("express")
const multer = require("multer")

const app = express()

// Middleware to read JSON data
app.use(express.json())

// Custom middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

// Multer configuration
const upload = multer({
    dest: "uploads/"
})

// GET route
app.get("/", (req, res) => {
    res.send("Express server is running")
})

// GET products
app.get("/products", (req, res) => {
    res.json([
        {
            id: 1,
            name: "Nike Air Max"
        },
        {
            id: 2,
            name: "Adidas Ultraboost"
        }
    ])
})

// POST products
app.post("/products", (req, res) => {
    const product = req.body

    res.status(201).json({
        message: "Product created",
        product: product
    })
})

// File upload
app.post("/upload", upload.single("image"), (req, res) => {
    console.log(req.file)

    res.json({
        message: "File uploaded successfully",
        file: req.file
    })
})

// Start server
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000")
})