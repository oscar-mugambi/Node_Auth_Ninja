const express = require("express")
const mongoose = require("mongoose")
const authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser")
const { requireAuth, checkUser } = require("./middleware/authMiddleware")
require("dotenv").config()
const app = express()
const { Router } = require("express")
const router = Router()

// middleware
app.use(express.static("public"))

app.use(express.json())

app.use(cookieParser())

// view engine
app.set("view engine", "ejs")

const port = process.env.PORT || 3000

// database connection
const dbURI =
  "mongodb+srv://oscarninja:Notorious97@cluster0.vkyid.mongodb.net/ninja-auth"
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err))

// routes
app.get("*", checkUser)
app.get("/", (req, res) => res.render("home"))
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"))
app.use(authRoutes)
