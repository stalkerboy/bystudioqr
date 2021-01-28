import * as qrService from "../service/qrService";
import Express from "express";

export default function (passport) {
  const router = Express.Router();

  router.get("/", qrService.qrSessionList);

  router.get("/confirm", qrService.qrConfirm);

  router.post("/visitor", qrService.qrVisitorGet);

  router.get("/image", qrService.qrImage);

  router.post("/complete", qrService.qrComplete);

  router.post("/excelupload", qrService.excelUpload);
  router.post("/delete", qrService.qrDelete);

  router.get("/register", qrService.qrRegister);

  router.post("/register", qrService.qrRegisterVisitor);

  return router;
}
