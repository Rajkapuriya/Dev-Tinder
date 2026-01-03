const express = require('express')

const requestRouter = express.Router()

requestRouter.get("/sendConnectionRequest", (req, res) => {
    const user = req.user
    res.send(user.FirstName + "sent the connect request")

})

module.exports = requestRouter