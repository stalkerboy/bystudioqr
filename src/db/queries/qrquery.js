export default {
  GET_QRSESSION_LIST: "BEGIN NSQPR_QRCODE_SESSION_SEL(:startDate, :endDate, :cursor); END;",
  GET_QRCONFIRM: `SELECT * FROM NSQT_QRCODE_SESSION WHERE CD_UUID=:1`,
  NSQPR_QRCODE_VISITOR_GET: "BEGIN  NSQPR_QRCODE_VISITOR_GET(:uuid, :cursor); END;",
  NSQPR_QRCODE_SESSION_DEL: "BEGIN  NSQPR_QRCODE_SESSION_DEL(:1); END;",
  NSQPR_QRCODE_ENTER: "BEGIN NSQPR_QRCODE_ENTER(:uuid, :purpose, :degree, :cursor); END;",
  NSQPR_QRCODE_VISITOR_INS: "BEGIN NSQPR_QRCODE_VISITOR_INS(:1, :2, :3, :4, :5, :6, :7); END;",
  NSQPR_TEST: `BEGIN  NSQPR_TEST(:id, :cursor); END;`,
};
