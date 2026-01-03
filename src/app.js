const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use(express.json());
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/request', requestRouter)


connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
