import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";

module.exports = function (config) {
  const app = express();
  app.use(express.static("public"));
  app.set("views", "./views");
  app.set("view engine", "pug");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(config.COOKIEPARSER_SECRET));
  app.use(
    session({
      secret: config.SESSION_SECRET,
      saveUninitialized: true,
      resave: false,
    })
  );
  app.use(flash());

  return app;
};
