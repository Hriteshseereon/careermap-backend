import jwt from "jsonwebtoken";

export const protectAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ✅ Ensure it's a real user token
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid auth token" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};