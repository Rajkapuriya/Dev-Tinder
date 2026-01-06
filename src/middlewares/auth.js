const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked!!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      throw new Error("Token is not valid")
    }
    const decodedObj = await jwt.verify(token, "Dev@Tinder")
    const { _id } = decodedObj
    if (!_id) {

    }
    const user = await User.findById(_id).select("+password");
    console.log("User Data" + user)
    if (!user) {
      throw new Error("User not found")
    }
    req.user = user
    next()
  } catch (err) {
    res.status(400).send("Unauthorized request - " + err.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
