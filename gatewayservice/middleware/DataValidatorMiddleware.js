module.exports = function (req, res, next) {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({ error: "Missing username" });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "Missing password" });
    return;
  }
  
  // Signup password validation
  if(req.originalUrl === "/adduser") {
    if (username.trim().length === 0) {
      res.status(400).json({ error: "Username should not be empty" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters long" });
      return;
    }

    if (!/[A-Z]/.test(password)) {
      res.status(400).json({ error: "Password must contain at least one uppercase letter" });
      return;
    }

    if (!/[a-z]/.test(password)) {
      res.status(400).json({ error: "Password must contain at least one lowercase letter" });
      return;
    }

    if (!/\d/.test(password)) {
      res.status(400).json({ error: "Password must contain at least one number" });
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      res.status(400).json({ error: "Password must contain at least one special character" });
      return;
    }
  }

  next();
};
