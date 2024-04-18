const express = require("express");
const {
  addUser,
  getUser
} = require("../controller/userController");
const Router = express.Router();

Router.route("/addUser").post(addUser);
Router.route("/getUser/:userId").get(getUser);

module.exports = Router;
