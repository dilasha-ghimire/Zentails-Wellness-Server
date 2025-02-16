const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your-default-secret-key";

function authenticateToken(req, res, next) {
  const token = req.headers("Authentication")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied: No token provided" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).send("Invalid token");
  }
}

function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
}


module.exports = { authenticateToken, authorizeRole };
