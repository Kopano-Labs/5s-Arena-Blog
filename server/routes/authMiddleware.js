import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authentication failed: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload (id, role) to the request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res
      .status(401)
      .json({ error: "Authentication failed: Invalid token" });
  }
};

export default authMiddleware;
