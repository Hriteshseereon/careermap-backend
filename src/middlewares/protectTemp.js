import jwt from "jsonwebtoken";

export const protectTemp = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ✅ Ensure it's OTP token
    if (!decoded.mobile) {
      return res.status(401).json({ message: "Invalid temp token" });
    }

    req.user = decoded; // contains mobile
    next();
  } catch {
    return res.status(401).json({ message: "Temp token expired or invalid" });
  }
};