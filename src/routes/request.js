const express = require('express')

const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
        if (fromUserId === toUserId) {
            return res.status(400).json({ message: "Cannot send connection request to yourself" })
        }
        const allowedStatus = ["interested", "ignored"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: `${status} is not a valid status` })
        }
        const userExist = await User.findById(
            toUserId
        )
        if (!userExist) {
            return res.status(404).json({ message: "User not Found" })
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exist" })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await connectionRequest.save()
        res.json({
            message: "Connection request sent successfully",
            data: connectionRequest
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);

    }
})


requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { status, requestId } = req.params
        console.log("loggedInUser" + loggedInUser, status, requestId)
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: `${status} is not a valid status` })
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId, toUserId: loggedInUser._id, status: "interested"
        })
        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection request not found" })
        }
        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({
            message: "Connection request" + status,
            data: data
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

module.exports = requestRouter