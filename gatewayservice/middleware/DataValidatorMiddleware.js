module.exports = function (req, res, next) {
  const { username, password } = req.body;
  if (!username) return next({ status: 400, error: "Missing username" });
  if (!password) return next({status: 400, error: "Missing password" });
  
  // Signup password validation
  if(req.originalUrl === "/adduser") {
    if (username.trim().length === 0) return next({status: 400, error: "Username should not be empty" });
    if (password.length < 8) return next({status: 400, error: "Password must be at least 8 characters long" });
    if (!/[A-Z]/.test(password)) return next({status: 400, error: "Password must contain at least one uppercase letter" });
    if (!/[a-z]/.test(password)) return next({status: 400, error: "Password must contain at least one lowercase letter" });
    if (!/\d/.test(password)) return next({status: 400, error: "Password must contain at least one number" });
    if (!/[^A-Za-z0-9]/.test(password)) return next({ status: 400, error: "Password must contain at least one special character" });
  }

  next();
};
