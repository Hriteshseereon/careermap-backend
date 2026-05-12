import { adminSignup, adminLogin } from "./adminauth.service.js";

// 🔹 Signup
export const signupAdmin = async (req, res) => {
  try {
    const result = await adminSignup(req.body);

    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const result = await adminLogin(email, password);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};