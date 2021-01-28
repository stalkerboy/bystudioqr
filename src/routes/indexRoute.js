import qrService from "../service/qrService";
import Express from "express";

module.exports = function (passport) {
  var router = Express.Router();

  router.get("/dbtest", qrService.qrSessionList);

  return router;
};
