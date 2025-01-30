const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "dc188b26fe49165c39fdecba3e1ad456ec220c369da48d07350ab18ee6c3af68";

function authenticateToken(req, res, next) {
  const token = req.header("Authentication")?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied: No token provided");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).send("Invalid token");
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role != role) {
      return res.status(403).send("Access Denied: Insufficient Permissions");
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
