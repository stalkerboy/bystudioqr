import userquery from "../db/queries/userquery";
import Bkfd2Password from "pbkdf2-password";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { dbexecute, dbParseResult, dbexecuteCur } from "./oracle";
import OracleDB from "oracledb";

export default function (app) {
  const hasher = Bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function (user, done) {
    const userloginfo = {
      ID_USER: user.ID_USER,
      DS_HNAME: user.DS_HNAME,
    };
    done(null, userloginfo);
  });

  passport.deserializeUser(function (userloginfo, done) {
    done(null, userloginfo);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async function (id_user, password, done) {
        let sql = userquery.NSQPR_PASSPORT_LOGIN_LOCAL;
        const result = await dbexecuteCur(sql, {
          id_user,
          cursor: { type: OracleDB.CURSOR, dir: OracleDB.BIND_OUT },
        });

        const users = await dbParseResult(result);
        let user;
        if (users.length === 1) {
          user = users[0];
        }

        if (user) {
          return hasher({ password: password, salt: user.CD_SALT }, async function (err, pass, salt, hash) {
            if (hash === user.PW_ENCRYPT) {
              sql = userquery.NSQPR_LOGIN_SUCCESS;
              await dbexecute(sql, [id_user]);
              const userinfo = { ID_USER: user.ID_USER, DS_HNAME: user.DS_HNAME };

              return done(null, userinfo, { loginMsg: "로그인 성공" });
            } else {
              sql = userquery.NSQPR_LOGIN_FAIL;
              await dbexecute(sql, [id_user]);
              return done(null, false, { loginMsg: "로그인을 실패했습니다." });
            }
          });
        } else {
          return done(null, false, { loginMsg: "로그인을 실패했습니다." });
        }
      }
    )
  );

  return passport;
}
