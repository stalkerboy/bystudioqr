import * as mainService from "../service/mainService";
import * as authService from "../service/authService";

import Express from "express";

export default function () {
  const router = Express.Router();

  router.get("/", authService.isAuthenticated, mainService.mainIndex);
  router.get("/login", function (req, res, next) {
    res.redirect("/user/login");
  });

  return router;
}
