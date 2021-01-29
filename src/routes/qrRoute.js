import * as qrService from "../service/qrService";
import * as authService from "../service/authService";
import Express from "express";

export default function (passport) {
  const router = Express.Router();

  router.get("/", authService.isAuthenticated, qrService.qrSessionList);

  router.get("/confirm", qrService.qrConfirm);

  router.post("/visitor", qrService.qrVisitorGet);

  router.get("/image", qrService.qrImage);

  router.post("/complete", qrService.qrComplete);

  router.post("/excelupload", authService.isAuthenticated, qrService.excelUpload);
  router.post("/delete", authService.isAuthenticated, qrService.qrDelete);

  router.get("/register", qrService.qrRegister);

  router.post("/register", qrService.qrRegisterVisitor);

  router.get("/test", qrService.qrTest);

  return router;
}
