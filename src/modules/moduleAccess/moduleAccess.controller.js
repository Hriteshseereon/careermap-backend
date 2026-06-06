import {
  checkModuleAccess,
} from "./moduleAccess.service.js";

export const checkModuleAccessController =
async (req, res) => {

  try {

    const result =
      await checkModuleAccess(
        req.user.id,
        req.body.moduleId
      );

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};