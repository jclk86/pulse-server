const express = require("express");
const UsersService = require("./user-service");
const userRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const path = require("path");

userRouter.post("/", bodyParser, (req, res, next) => {
  const { username, password, email, fullname } = req.body;

  for (const field of ["username", "password", "email", "fullname"])
    if (!req.body[field])
      return res
        .status(400)
        .json({ error: `Missing '${field}' in request body` });

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get("db"), username).then(
    hasUserWithUserName => {
      if (hasUserWithUserName) {
        return res.status(400).json({ error: `Username already taken` });
      }
      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          username,
          password: hashedPassword,
          fullname,
          email,
          date_created: "now()"
        };
        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/login`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    }
  );
});

userRouter
  .route("/profile")
  .all(requireAuth)
  .all(checkUserExists)
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(req.user));
  })
  .patch(bodyParser, (req, res, next) => {
    const { username, password, profile } = req.body;

    for (const field of ["password", "profile"])
      if (!req.body[field])
        return res
          .status(400)
          .json({ error: `Missing '${field}' in request body` });

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hashPassword(password).then(hashedPassword => {
      const updatedUser = {
        username,
        password: hashedPassword,
        profile
      };
      return UsersService.updateUser(
        req.app.get("db"),
        res.user.id,
        updatedUser
      ).then(user => {
        res
          .status(204)
          .location(path.posix.join(req.originalUrl, `/login`))
          .json(UsersService.serializeUser(user));
      });
    });
  });

async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getById(req.app.get("db"), req.user.id);
    if (!user)
      return res.status(404).json({
        error: `User doesn't exist`
      });
    res.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = userRouter;
