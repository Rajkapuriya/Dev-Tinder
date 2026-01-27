const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const userRouter = express.Router()

userRouter.get("/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user
        const pendingConnection = await ConnectionRequest.find({
            toUserId: loggedInUser._id, status: "accepted"
        }).populate('fromUserId', ["firstName", "lastName"])
        console.log("pendingConnection", pendingConnection)
        res.json({ message: "Data Fetched Successfully", data: pendingConnection })
    }
    catch (err) {
        res.status(400).send("Something went wrong" + err.message)
    }
})

userRouter.get("/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" }, { fromUserId: loggedInUser._id, status: "accepted" }],

        })
            .populate('fromUserId', ["firstName", "lastName"])
            .populate('toUserId', ["firstName", "lastName"])
        console.log("connectionRequest", connectionRequest)
        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ message: "Data Fetched Successfully", data: data })
    }
    catch (err) {
        res.status(400).send("Something went wrong" + err.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        const users = await User.find({
            $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id } }]
        }).select("firstName lastName").skip(skip).limit(limit)
        res.json({ message: "Data Fetched Successfully", data: users })
    }
    catch (err) {
        res.status(400).send("Something went wrong" + err.message)
    }
})

module.exports = userRouter