module.exports = (i18next) => (req, res, next) => {
  const { username, password } = req.body;
  if (!("username" in req.body)) return next({ status: 400, error: `${i18next.t("error_missing_field")} username` });
  if (!("password" in req.body)) return next({ status: 400, error: `${i18next.t("error_missing_field")} password` });
  
  // Signup password validation
  if(req.originalUrl === "/adduser") {
    if (username.trim().length === 0) return next({status: 400, error: i18next.t("error_username_empty") });
    if (password.length < 8) return next({status: 400, error: i18next.t("error_password_short") });
    if (!/[A-Z]/.test(password)) return next({status: 400, error: i18next.t("error_password_uppercase") });
    if (!/[a-z]/.test(password)) return next({status: 400, error: i18next.t("error_password_lowercase") });
    if (!/\d/.test(password)) return next({status: 400, error: i18next.t("error_password_number") });
    if (!/[^A-Za-z0-9]/.test(password)) return next({ status: 400, error: i18next.t("error_password_special") });
  }

  next();
};
