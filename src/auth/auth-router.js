const express = require("express");
const AuthService = require("./auth-service");
const bodyParser = express.json();
const authRouter = express.Router();
const bodyParser = express.json();

authRouter.post("/login", bodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });

  AuthService.getUserWithUserName(req.app.get("db"), loginUser.username)
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect username"
        });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then(compareMatch => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect password"
          });
        res.send("logged in!");
      });
    })
    .catch(next);
});

module.exports = authRouter;
