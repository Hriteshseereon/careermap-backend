import jwt from "jsonwebtoken";

export const protectTemp = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // If tempToken is provided in Authorization header
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (!decoded.mobile || decoded.type !== "temp") {
        return res.status(401).json({ message: "Invalid temp token" });
      }
      req.user = decoded; // contains mobile
      return next();
    }

    // Fallback: If no token provided but mobile is in body (for direct testing)
    if (req.body?.mobile) {
      req.user = { mobile: req.body.mobile };
      return next();
    }

    return res.status(401).json({ message: "Mobile number or temp token required" });
  } catch {
    return res.status(401).json({ message: "Temp token expired or invalid" });
  }
};