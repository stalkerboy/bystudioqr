export const mainIndex = function (req, res) {
  var loginMsg = req.flash("loginMsg");
  res.render("index", { user: req.user, loginMsg: loginMsg });
};
