import bcrypt from "bcryptjs";
import { AdminAuthRepository } from "./adminauth.repository.js";
import { generateAdminTokens } from "../../utils/helpers.js";
import jwt from "jsonwebtoken";
// 🔹 Signup (optional)
export const adminSignup = async (body) => {
  try {
    console.log("📩 Incoming body:", body);

    const { email, password, ...rest } = body;

    console.log("🔍 Checking existing admin...");
    const existing = await AdminAuthRepository.findByEmail(email);

    console.log("👤 Existing admin:", existing);

    if (existing) {
      return { success: false, message: "Admin already exists" };
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("💾 Creating admin...");
    const admin = await AdminAuthRepository.createAdmin({
      email,
      password: hashedPassword,
      ...rest,
    });

    console.log("✅ Admin created:", admin);

    // const tokens = generateAdminTokens(admin);

    return {
      success: true,
      message: "Admin created successfully",
      admin,

    };

  } catch (error) {
    console.error("❌ Service Error (adminSignup):", error);
    return { success: false, message: error.message };
  }
};
// 🔹 Login
export const adminLogin = async (email, password) => {
  const admin = await AdminAuthRepository.findByEmail(email);

  if (!admin) {
    return { success: false, message: "Admin not found" };
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return { success: false, message: "Invalid credentials" };
  }

  const tokens = generateAdminTokens(admin);

  return {
    success: true,
    message: "Admin login successful",
    admin,
    ...tokens,
  };
};

export const refreshAdminToken = async (
  refreshToken
) => {
  try {

    const decoded = jwt.verify(
      refreshToken,
      process.env.ADMIN_JWT_REFRESH_SECRET
    );

    console.log(decoded);

    if (decoded.type !== "admin") {
      return {
        success: false,
        message: "Invalid token"
      };
    }

    const admin =
      await AdminAuthRepository.findById(
        decoded.adminId
      );

    if (!admin) {
      return {
        success: false,
        message: "Admin not found"
      };
    }

    const accessToken = jwt.sign(
      {
        adminId: admin.id,
        role: admin.role,
        type: "admin"
      },
      process.env.ADMIN_JWT_ACCESS_SECRET,
      {
        expiresIn: "15m"
      }
    );

    return {
      success: true,
      accessToken
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message: error.message
    };
  }
};

export const logoutAdmin = async () => {
  return {
    success: true,
    message: "Admin logged out successfully",
  };
};