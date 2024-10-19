const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImgURL: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

const Blog = model("Blog", blogSchema);

module.exports = Blog;
