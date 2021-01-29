export const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

export const isNotAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect("/qr");
};
