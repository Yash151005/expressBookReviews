const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bodyParser = require('body-parser');

const { general } = require('./router/general.js');
const { authenticated } = require('./router/auth_users_router.js');

const app = express();
const PORT = 5000;
const JWT_SECRET = "fingerprint_customer";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: "fingerprintcustomer",
  resave: true,
  saveUninitialized: true
}));

// JWT Authentication middleware for /customer/auth/* routes
app.use("/customer/auth", (req, res, next) => {
  if (req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Mount routers
app.use("/customer", authenticated);
app.use("/", general);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;