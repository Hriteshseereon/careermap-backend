import prisma from "../config/db.js";

export const checkPermission =
(module, action) =>
async (req, res, next) => {

  try {

    // Admin bypass
    if (req.admin) {
      return next();
    }

    const permission =
      await prisma.permission.findFirst({
        where: {
          roleId: req.staff.roleId,
          module,
        },
      });

    const actionField =
      `can${action.charAt(0).toUpperCase()}${action.slice(1)}`;

    if (
      !permission ||
      !permission[actionField]
    ) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    next();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};