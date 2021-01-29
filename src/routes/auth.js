export default function (passport) {
  const route = require("express").Router();

  route.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/qr",
      failureRedirect: "/login",
      failureFlash: false,
    })
  );

  route.get("/login", function (req, res) {
    res.render("/login");
  });

  route.get("/logout", function (req, res) {
    req.logout();
    req.session.save(function () {
      res.redirect("/login");
    });
  });
  return route;
}
