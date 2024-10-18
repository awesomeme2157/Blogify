const mongoose = require("mongoose");
const { Schema } = mongoose;
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageURL: {
            type: String,
            default: "./public/images/default.avif",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    { timestamps: true }
);

// Pre-save hook to hash the password
userSchema.pre("save", function (next) {
    const user = this;

    // Check if the password is modified or new
    if (!user.isModified("password")) return next();

    // Generate a salt and hash the password
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    // Set the salt and hashed password
    user.salt = salt;
    user.password = hashedPassword;

    next();
});

// Static method to match password
userSchema.statics.matchPassword = async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found!");

    console.log(user);

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect password!");

    // Return user object without password and salt
    return { ...user.toObject(), password: undefined, salt: undefined };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
