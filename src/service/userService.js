export const login = function (req, res) {
  var loginMsg = req.flash("loginMsg");
  res.render("login", { user: req.user, loginMsg });
};

export const loginProcess = function (passport) {
  var rtnFun = function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("loginMsg", info.loginMsg);
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          req.flash("loginMsg", info.loginMsg);
          return next(err);
        }
        return res.redirect("/qr");
      });
    })(req, res, next);
  };
  return rtnFun;
};

export const logoutProcess = function () {
  var rtnFun = function (req, res) {
    req.logout();
    req.session.save(function () {
      res.redirect("/login");
    });
  };
  return rtnFun;
};
