const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData, validateUpdatePassword } = require('../utils/validation');
const bcrypt = require('bcrypt')
const profileRouter = express.Router()

profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Something went wrong ");
    }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Request")
        }
        console.log("Req body", req.body)
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        console.log("loggedInUser", loggedInUser)
        await loggedInUser.save()

        res.json({ message: "Profile updated Successfully", data: loggedInUser })
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
});

profileRouter.patch("/updatepassword", userAuth, async (req, res) => {
    try {
        if (!validateUpdatePassword(req)) {
            throw new Error("Invalid Edit Request")
        }

        const { currentPassword, updatedPassword } = req.body;
        const passwordHash = await bcrypt.hash(updatedPassword, 10);
        console.log(passwordHash, req.user);
        req.user.password = passwordHash;
        await req.user.save();
        res.json({
            message: "Password updated successfully",
        });
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
});

module.exports = profileRouter