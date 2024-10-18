const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogify').then(() => {
    console.log("MongoDB Connected");
})
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const userRoute = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
