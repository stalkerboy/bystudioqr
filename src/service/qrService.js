import qrquery from "../db/queries/qrquery";

import { dbexecuteCur, dbexecuteMany } from "../bymodules/oracle";
import OracleDB from "oracledb";
import { v4 as uuid } from "uuid";
import Multiparty from "multiparty";
import Xlsx from "xlsx";

export const qrSessionList = async function (req, res, next) {
  const sql = qrquery.GET_QRSESSION_LIST;
  let results = await dbexecuteCur(sql, {
    startDate: req.query.startDate ? req.query.startDate : "",
    endDate: req.query.endDate ? req.query.endDate : "",
    cursor: { type: OracleDB.CURSOR, dir: OracleDB.BIND_OUT },
  });
  res.render("qr/sessionList", { title: "QR Sesion List", results, startDate: req.query.startDate, endDate: req.query.endDate });
};

export const qrConfirm = async function (req, res, next) {
  const access = req.flash("access");
  res.render("qr/confirm", { title: "QR Sesion List", access, uuid: req.query.uuid });
};

export const qrRegister = async function (req, res, next) {
  const access = req.flash("access");
  res.render("qr/register", { title: "QR Sesion List" });
};

export const qrRegisterVisitor = async function (req, res, next) {
  const sql = qrquery.NSQPR_QRCODE_REGISTER;
  console.log(req.body);
  const uuid = uuid() + "*";
  const binds = [...req.body, uuid];
  console.log(binds);
  // let results = await dbexecuteCur(sql, binds);
  // // res.render('qrConfirm',  { title: 'QR Sesion List' , access });
  // console.log(results.rows[0])
  res.redirect("/qr/confirm?uuid=" + results.uuid);
};

export const qrVisitorGet = async function (req, res, next) {
  const sql = qrquery.NSQPR_QRCODE_VISITOR_GET;
  let results = await dbexecuteCur(sql, {
    uuid: req.body.CD_UUID,
    cursor: { type: OracleDB.CURSOR, dir: OracleDB.BIND_OUT },
  });
  if (results && results.rows.length == 1) {
    res.json(results);
  } else {
    res.status(500);
  }
};

export const qrComplete = async function (req, res, next) {
  const sql = qrquery.NSQPR_QRCODE_ENTER;
  let results = await dbexecuteCur(sql, {
    uuid: req.body.CD_UUID,
    purpose: req.body.DS_PURPOSE,
    degree: req.body.NO_DEGREE,
    cursor: { type: OracleDB.CURSOR, dir: OracleDB.BIND_OUT },
  });
  if (results && results.rows.length > 0 && results.rows[0][0] == 1) {
    req.flash("access", 1);
  } else {
    req.flash("access", 2);
  }
  // res.render('qrConfirm',  { title: 'QR Sesion List' , access });
  res.redirect("/qr/confirm");
};

export const qrTest = async function (req, res, next) {
  const sql = qrquery.NSQPR_TEST;
  let results = await dbexecuteCur(sql, {
    id: 3,
    cursor: { type: OracleDB.CURSOR, dir: OracleDB.BIND_OUT },
  });
  res.send(results);
};

export const qrImage = async function (req, res, next) {
  res.render("qr/image", { title: "QR Image", uuid: req.query.uuid });
};

export const excelUpload = async function (req, res, next) {
  const resData = {};
  const form = new Multiparty.Form({
    autoFiles: true,
  });
  try {
    form.on("file", (name, file) => {
      const workbook = Xlsx.readFile(file.path);

      const sheetnames = Object.keys(workbook.Sheets);
      let i = sheetnames.length;
      while (i--) {
        const sheetname = sheetnames[i];
        resData[sheetname] = Xlsx.utils.sheet_to_json(workbook.Sheets[sheetname], { header: "A", raw: false });
      }
    });

    form.on("close", async () => {
      const sheet1 = resData.Sheet1;

      // const metaData = []
      const binds = [];
      for (i in sheet1) {
        // if(i==1)
        //     Object.keys(sheet1[i]).forEach(function(key){metaData.push(sheet1[i][key]);});
        if (i > 1) {
          const row = [];
          Object.keys(sheet1[i]).forEach(function (key) {
            row.push(sheet1[i][key]);
          });
          row[6] = uuid() + "*"; //generate uuid
          binds.push(row);
        }
      }

      // :ds_hname, :ds_phone, :ds_dept, :dt_booking_fr, :dt_booking_to, :ds_purpose, :cd_uuid
      sql = qrquery.NSQPR_QRCODE_EXCEL_UPLOAD;
      const result = await dbexecuteMany(sql, binds);

      res.json(result);
    });

    form.parse(req);
  } catch (e) {
    res.json(e);
  }
};

export const qrDelete = async function (req, res, next) {
  const sql = qrquery.NSQPR_QRCODE_SESSION_DEL;
  const binds = req.body.UUIDS;
  let result = await dbexecuteMany(sql, binds);
  res.json(result);
};
