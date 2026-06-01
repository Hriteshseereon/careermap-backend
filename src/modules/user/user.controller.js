import { registerUser,  updateProfile,changePassword,forgotPassword,resetPassword } from "./user.service.js";

export const signup = async (req, res) => {
  try {
    const data = await registerUser(req.body, req.user.mobile);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: data.user,
      accessToken: data.accessToken,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProfileController =
async (req, res) => {

  try {

    const user =
      await updateProfile(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      data: user,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePasswordController =
async (req, res) => {

  try {

    const result =
      await changePassword(
        req.user.id,
        req.body
      );

    res.status(200).json(result);

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPasswordController =
async (req,res) => {

  const result =
    await forgotPassword(
      req.body.email
    );

  res.json(result);
};

export const resetPasswordController =
async (req,res) => {

  const result =
    await resetPassword(
      req.body.token,
      req.body.newPassword,
      req.body.confirmPassword
    );

  res.json(result);
};