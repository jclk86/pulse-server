const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUserWithUserName(db, username) {
    return db("travelist")
      .where({ username })
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  }
};

module.exports = AuthService;
