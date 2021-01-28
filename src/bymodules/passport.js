import userquery from "../db/queries/userquery";
import bkfd2Password from "pbkdf2-password";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export default function (app, conn) {
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function (user, done) {
    console.log("serializeUser : ");
    var userloginfo = {
      USER_ID: user.USER_ID,
      USER_REG_TYPE: user.USER_REG_TYPE,
      USER_NAME: user.USER_NAME,
    };
    done(null, userloginfo);
  });

  passport.deserializeUser(function (userloginfo, done) {
    console.log("deserializeUser : ", userloginfo);
    done(null, userloginfo);
  });

  passport.use(
    new LocalStrategy(function (user_id, password, done) {
      var sql = userquery.PASSPORT_LOGIN_LOCAL;
      var userloginfo = [user_id, "LOCAL"];
      conn.query(sql, userloginfo, function (err, results) {
        if (err) {
          return done("There is no user.");
        }
        var user = results[0];
        if (user) {
          return hasher({ password: password, salt: user.USER_SALT }, function (err, pass, salt, hash) {
            if (hash === user.USER_PW && user.LOGIN_FAIL_CNT < 20) {
              sql = userquery.USER_LOGIN_SUCCESS;
              conn.query(sql, userloginfo, function (err, results) {
                if (err) done("Error.");
              });
              return done(null, user, { loginMsg: "로그인 성공" });
            } else {
              sql = userquery.USER_LOGIN_FAIL;
              conn.query(sql, userloginfo, function (err, results) {
                if (err) done("Error.");
              });
              if (user.LOGIN_FAIL_CNT > 30) {
                return done(null, false, { loginMsg: "로그인 시도 가능 횟수가 초과되었습니다." });
              } else {
                return done(null, false, { loginMsg: "로그인을 실패했습니다." });
              }
            }
          });
        } else {
          return done(null, false, { loginMsg: "로그인을 실패했습니다." });
        }
      });
    })
  );

  return passport;
}
