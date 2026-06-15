import jwt from "jsonwebtoken";

export const protectAdminOrStaff =
async (req, res, next) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Admin Check
    try {

      const admin = jwt.verify(
        token,
        process.env.ADMIN_JWT_ACCESS_SECRET
      );

      if (admin.type === "admin") {
        req.admin = admin;
        return next();
      }

    } catch (err) {}

    // Staff Check
    try {

      const staff = jwt.verify(
        token,
        process.env.STAFF_SECRET
      );

      req.staff = staff;

      return next();

    } catch (err) {}

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};