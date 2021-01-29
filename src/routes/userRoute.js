import Express from "express";
import * as userService from "../service/userService";
import * as authService from "../service/authService";

module.exports = function (passport) {
  const router = Express.Router();

  router.get("/login", authService.isNotAuthenticated, userService.login);

  router.post("/login", userService.loginProcess(passport));

  router.get("/logout", userService.logoutProcess());

  return router;
};
