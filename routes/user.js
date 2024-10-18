const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        });

        return res.redirect("/");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error signing up");
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = User.matchPassword(email, password);

    console.log("User", user);
    return res.redirect("/");
})

module.exports = router;
