const express = require("express");
const multer = require('multer');
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads"));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

// Route to render the 'add blog' form
router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate("createdBy");
    // console.log(blog);
    const comments = await Comment.find({ blogId: id }).populate("createdBy");
    console.log("Comments : ", comments);

    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    });
});

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

// Route to handle blog post submission
router.post("/", upload.single("coverImage"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("Invalid file upload");
    }

    const { title, body } = req.body;

    // Create new blog entry
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImgURL: `/uploads/${req.file.filename}`,
    });

    // Redirect to the newly created blog post page
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
