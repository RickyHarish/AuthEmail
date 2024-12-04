const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token");

router.post("/", async (req, res) => {
    try {
        // Validate user input
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Check if the user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User with given email already exists!" });

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        user = await new User({ ...req.body, password: hashPassword, verified: false }).save();

        // Create verification token
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        // Generate verification URL
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", `Click the link to verify your email: ${url}`);

        res.status(201).send({ message: "An email has been sent to your account. Please verify." });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/:id/verify/:token", async (req, res) => {
    try {
        const { id, token } = req.params;

        // Find user by ID
        const user = await User.findById(id);
        if (!user) return res.status(400).send({ message: "Invalid link" });

        // Find token
        const verificationToken = await Token.findOne({ userId: user._id, token });
        if (!verificationToken) return res.status(400).send({ message: "Invalid or expired link" });

        // Mark user as verified
        user.verified = true;
        await user.save();

        // Remove the token after verification
        await verificationToken.deleteOne();

        res.status(200).send({ message: "Email verification successful" });
    } catch (error) {
        console.error("Error in email verification:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
