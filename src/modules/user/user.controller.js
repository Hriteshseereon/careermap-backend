import { registerUser } from "./user.service.js";

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

