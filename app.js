const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const Blog = require("./models/blog");

const { checkForAuthentocationCookie } = require("./middlewares/auth");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files like the uploaded images
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(checkForAuthentocationCookie("token"));

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB Connected");
})
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
